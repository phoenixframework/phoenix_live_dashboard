defmodule Phoenix.LiveDashboard.EctoReposPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  @compile {:no_warn_undefined, [{Ecto.Repo, :all_running, 0}]}
  @page_title "Ecto Repos"

  @impl true
  def init(%{
        repos: repos
      }) do
    capabilities = for repo <- List.wrap(repos), do: {:process, repo}
    repos = repos || :auto_discover

    {:ok,
     %{
       repos: repos
     }, capabilities}
  end

  @impl true
  def mount(_params, %{repos: repos}, socket) do
    result =
      case repos do
        :auto_discover ->
          auto_discover(socket.assigns.page.node)

        [_ | _] = repos ->
          {:ok, repos}

        _ ->
          {:error, :no_ecto_repos_available}
      end

    case result do
      {:ok, repos} ->
        {:ok, assign(socket, :repos, repos)}

      {:error, error} ->
        {:ok, assign(socket, :error, error)}
    end
  end

  @impl true

  def menu_link(%{repos: []}, _capabilities) do
    :skip
  end

  @impl true
  def menu_link(%{repos: :auto_discover}, _caps) do
    # We require the extras plugins to be on this node,
    # which means we also require Ecto.Adapters.SQL on this node.
    if Code.ensure_loaded?(Ecto.Adapters.SQL) do
      {:ok, @page_title}
    else
      :skip
    end
  end

  @impl true
  def menu_link(%{repos: repos}, capabilities) do
    if Enum.all?(repos, fn repo -> repo not in capabilities.processes end) do
      :skip
    else
      {:disabled, @page_title}
    end
  end

  @impl true
  def render_page(assigns) do
    if assigns[:error] do
      render_error(assigns)
    else
      current_node = assigns.page.node

      items =
        for repo <- assigns.repos do
          {repo,
           name: inspect(repo),
           render: fn ->
             render_repo_tab(%{
               repo: repo,
               node: current_node
             })
           end}
        end

      nav_bar(items: items, nav_param: :repo, extra_params: [:nav], style: :bar)
    end
  end

  defp render_repo_tab(assigns) do
    nav_bar(items: items(assigns), extra_params: [:repo])
  end

  defp items(%{repo: repo}) do
    for tab <- [:migrations] do
      {tab,
       name: Phoenix.Naming.humanize(tab),
       render: fn ->
         render_migrations(repo, tab)
       end}
    end
  end

  defp render_migrations(repo, table_name) do
    columns = [
      %{field: :status, sortable: :asc},
      %{field: :name, sortable: :asc},
      %{field: :number, sortable: :asc}
    ]

    searchable = [:name]
    default_sort_by = :number

    table(
      id: :table_id,
      hint: "Database migrations for #{inspect(repo)}",
      limit: false,
      default_sort_by: default_sort_by,
      search: searchable != [],
      columns: columns,
      rows_name: "entries",
      row_fetcher: &row_fetcher(repo, searchable, &1, &2),
      title: Phoenix.Naming.humanize(table_name)
    )
  end

  defp row_fetcher(repo, searchable, params, _node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir} = params

    mapped =
      repo
      |> Ecto.Migrator.migrations()
      |> Enum.map(fn {status, number, name} ->
        %{status: status, number: number, name: Phoenix.Naming.humanize(name)}
      end)

    filtered =
      if search do
        Enum.filter(mapped, fn map ->
          Enum.any?(searchable, fn column ->
            value = Map.fetch!(map, column)
            value && value =~ search
          end)
        end)
      else
        mapped
      end

    sorted = Enum.sort_by(filtered, fn row -> row[sort_by] end, sort_dir)

    {sorted, length(sorted)}
  end

  defp auto_discover(node) do
    case :rpc.call(node, Ecto.Repo, :all_running, []) do
      [] ->
        {:error, :no_ecto_repos_available}

      repos when is_list(repos) ->
        {:ok, repos}

      {:badrpc, _error} ->
        {:error, :cannot_list_running_repos}
    end
  end

  defp render_error(assigns) do
    error_message =
      case assigns.error do
        :no_ecto_repos_available ->
          ~H"""
          <small>
            No Ecto repository was found running on this node.
            Currently only Postgres and MySQL databases are supported.
          </small>
          """

        :cannot_list_running_repos ->
          ~H"""
          <small>
            Cannot list running repositories.
            Make sure that Ecto is running with version ~> 3.7.
          </small>
          """
      end

    card(value: error_message)
  end
end
