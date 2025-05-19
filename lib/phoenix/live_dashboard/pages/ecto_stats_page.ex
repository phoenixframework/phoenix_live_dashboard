defmodule Phoenix.LiveDashboard.EctoStatsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder
  import Phoenix.LiveDashboard.Helpers

  @compile {:no_warn_undefined, [Decimal, Duration, EctoPSQLExtras, {Ecto.Repo, :all_running, 0}]}
  @disabled_link "https://hexdocs.pm/phoenix_live_dashboard/ecto_stats.html"
  @page_title "Ecto Stats"

  @impl true
  def init(%{
        repos: repos,
        ecto_psql_extras_options: ecto_psql_extras_options,
        ecto_mysql_extras_options: ecto_mysql_extras_options,
        ecto_sqlite3_extras_options: ecto_sqlite3_extras_options
      }) do
    capabilities = for repo <- List.wrap(repos), do: {:process, repo}
    repos = repos || :auto_discover

    {:ok,
     %{
       repos: repos,
       ecto_options: [
         ecto_psql_extras_options: ecto_psql_extras_options,
         ecto_mysql_extras_options: ecto_mysql_extras_options,
         ecto_sqlite3_extras_options: ecto_sqlite3_extras_options
       ]
     }, capabilities}
  end

  @impl true
  def mount(_params, %{repos: repos, ecto_options: ecto_options}, socket) do
    socket = assign(socket, ecto_options: ecto_options)

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

  defp auto_discover(node) do
    case named_stats_available_repos(node) do
      {:ok, [_ | _] = repos} ->
        {:ok, repos}

      {:ok, []} ->
        {:error, :no_ecto_repos_available}

      {:error, _} = error ->
        error
    end
  end

  defp named_stats_available_repos(node) do
    try do
      :erpc.call(node, Ecto.Repo, :all_running, [])
    catch
      _, _ ->
        {:error, :cannot_list_running_repos}
    else
      repos when is_list(repos) ->
        {:ok, Enum.filter(repos, fn repo -> extra_available?(node, repo) end)}
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
    cond do
      Enum.all?(repos, fn repo -> repo not in capabilities.processes end) ->
        :skip

      extra_available_for_any?(Node.self(), repos) ->
        {:ok, @page_title}

      true ->
        {:disabled, @page_title, @disabled_link}
    end
  end

  defp extra_available_for_any?(node, repos) do
    Enum.any?(repos, fn repo -> extra_available?(node, repo) end)
  end

  defp extra_available?(node, repo) when is_atom(repo) do
    extra = info_module_for(node, repo)
    extra && extra_loaded?(extra)
  end

  defp extra_available?(_node, _repo_pid), do: false

  # We check if the extra module is available locally, because
  # that module should be able to send RPC calls. Therefore the
  # user does not need to have extra module installed on every node.
  defp extra_loaded?(extra) do
    Code.ensure_loaded?(extra)
  end

  defp info_module_for(node, repo) do
    case :erpc.call(node, repo, :__adapter__, []) do
      Ecto.Adapters.Postgres -> EctoPSQLExtras
      Ecto.Adapters.MyXQL -> EctoMySQLExtras
      Ecto.Adapters.SQLite3 -> EctoSQLite3Extras
      _ -> nil
    end
  end

  @impl true
  def render(assigns) do
    if assigns[:error] do
      render_error(assigns)
    else
      ~H"""
      <.live_nav_bar
        id="repos_nav_bar"
        page={@page}
        nav_param="repo"
        style={:bar}
        extra_params={["nav"]}
      >
        <:item :for={repo <- @repos} name={inspect(repo)} label={inspect(repo)}>
          <.render_repo_tab
            page={@page}
            repo={repo}
            ecto_options={@ecto_options}
            info_module={info_module_for(@page.node, repo)}
          />
        </:item>
      </.live_nav_bar>
      """
    end
  end

  defp render_repo_tab(assigns) do
    ~H"""
    <.live_nav_bar id="queries_nav_bar" page={@page} extra_params={["repo"]}>
      <:item
        :for={{table_name, info} <- queries(@page.node, @repo, @info_module)}
        name={to_string(table_name)}
      >
        <.live_table
          id={"table_#{table_name}"}
          page={@page}
          title={Phoenix.Naming.humanize(table_name)}
          hint={info.title}
          limit={false}
          search={info.searchable != []}
          default_sort_by={info.default_sort_by}
          rows_name="entries"
          row_fetcher={
            &row_fetcher(@repo, @info_module, table_name, info.searchable, @ecto_options, &1, &2)
          }
        >
          <:col :let={row} :for={col <- info.columns} field={col.name} sortable={sortable(col.type)}>
            <%= format(col.type, row[col.name]) %>
          </:col>
        </.live_table>
      </:item>
    </.live_nav_bar>
    """
  end

  @forbidden_tables [:kill_all, :mandelbrot]

  defp queries(node, repo, info_module) do
    info_module.queries({repo, node})
    |> Enum.reject(fn {table_name, _table_module} -> table_name in @forbidden_tables end)
    |> Enum.map(fn {table_name, table_module} -> {table_name, table_module.info()} end)
    |> Enum.sort(fn {_, a_info}, {_, b_info} -> a_info[:index] < b_info[:index] end)
    |> Enum.map(fn {table_name, info} -> {table_name, normalize_info(info)} end)
  end

  defp normalize_info(info) do
    searchable = for %{type: :string, name: name} <- info.columns, do: name
    default_sort_by = with [{column, _} | _] <- info[:order_by], do: to_string(column)

    info
    |> Map.put(:searchable, searchable)
    |> Map.put(:default_sort_by, default_sort_by)
  end

  defp sortable(:string), do: :asc
  defp sortable(_), do: :desc

  defp row_fetcher(repo, info_module, table_name, searchable, ecto_options, params, node) do
    ecto_db_extras_options =
      case info_module do
        EctoPSQLExtras -> Keyword.fetch!(ecto_options, :ecto_psql_extras_options)
        EctoMySQLExtras -> Keyword.fetch!(ecto_options, :ecto_mysql_extras_options)
        EctoSQLite3Extras -> Keyword.fetch!(ecto_options, :ecto_sqlite3_extras_options)
        _ -> []
      end

    opts =
      case Keyword.fetch(ecto_db_extras_options, table_name) do
        {:ok, args} -> [args: args]
        :error -> []
      end
      |> Keyword.merge(format: :raw)

    %{columns: columns, rows: rows} = info_module.query(table_name, {repo, node}, opts)

    mapped =
      for row <- rows do
        columns
        |> Enum.zip(row)
        |> Map.new(fn {key, value} -> {String.to_atom(key), value} end)
      end

    %{search: search, sort_by: sort_by, sort_dir: sort_dir} = params

    mapped =
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

    sorted =
      Enum.sort_by(mapped, &Map.fetch!(&1, sort_by), fn
        # Handle structs
        %struct{} = left, %struct{} = right ->
          case struct.compare(left, right) do
            :gt when sort_dir == :asc -> false
            :lt when sort_dir == :desc -> false
            _ -> true
          end

        # Nils are always last regardless of ordering
        nil, _ ->
          false

        _, nil ->
          true

        # Handle all other types
        left, right when sort_dir == :asc ->
          left <= right

        left, right when sort_dir == :desc ->
          left >= right
      end)

    {sorted, length(rows)}
  end

  defp format(_, %struct{} = value) when struct in [Decimal, Duration, Postgrex.Interval],
    do: struct.to_string(value)

  defp format(:bytes, value) when is_integer(value),
    do: format_bytes(value)

  defp format(:percent, value) when is_number(value),
    do: value |> Kernel.*(100.0) |> Float.round(1) |> Float.to_string()

  defp format(_type, value),
    do: value

  defp render_error(assigns) do
    case assigns.error do
      :no_ecto_repos_available ->
        ~H"""
        <.card>
          <small>
            No Ecto repository was found running on this node.
            Currently, only PostgreSQL, MySQL, and SQLite databases are supported.

            Depending on the database, ecto_psql_extras, ecto_mysql_extras, or ecto_sqlite3_extras should be installed.

            Check the
            <a href="https://hexdocs.pm/phoenix_live_dashboard/ecto_stats.html" target="_blank">
              documentation
            </a>
            for details.
          </small>
        </.card>
        """

      :cannot_list_running_repos ->
        ~H"""
        <.card>
          <small>
            Cannot list running repositories.
            Make sure that Ecto is running with version ~> 3.7.
          </small>
        </.card>
        """
    end
  end
end
