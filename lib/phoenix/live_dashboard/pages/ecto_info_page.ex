defmodule Phoenix.LiveDashboard.EctoInfoPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  @compile {:no_warn_undefined, [Decimal, EctoPSQLExtras]}
  @disabled_link "https://hexdocs.pm/phoenix_live_dashboard/ecto_info.html"

  @impl true
  def init(%{repo: nil}), do: {:ok, %{repo: nil}}
  def init(%{repo: repo}), do: {:ok, %{repo: repo}, process: repo}

  @impl true
  def mount(_params, %{repo: repo}, socket) do
    {:ok, assign(socket, repo: repo, info_module: info_module_for(repo))}
  end

  @impl true
  def menu_link(%{repo: nil}, _capabilities) do
    if Code.ensure_loaded?(Ecto.Adapters.SQL) do
      {:disabled, "Ecto Info", @disabled_link}
    else
      :skip
    end
  end

  @impl true
  def menu_link(%{repo: repo}, capabilities) do
    title = "#{repo |> inspect() |> String.replace(".", " ")} Info"
    extra = info_module_for(repo)

    cond do
      repo not in capabilities.processes ->
        :skip

      extra && Code.ensure_loaded?(extra) ->
        {:ok, title}

      true ->
        {:disabled, title, @disabled_link}
    end
  end

  defp info_module_for(repo) do
    case repo.__adapter__ do
      Ecto.Adapters.Postgres -> EctoPSQLExtras
      _ -> nil
    end
  end

  @impl true
  def render_page(assigns) do
    nav_bar(items: items(assigns))
  end

  @forbidden_tables [:kill_all, :mandelbrot]

  defp items(%{repo: repo, info_module: info_module}) do
    for {table_name, table_module} <- info_module.queries(),
        table_name not in @forbidden_tables do
      {table_name,
       name: Phoenix.Naming.humanize(table_name),
       render: fn -> render_table(repo, info_module, table_name, table_module) end}
    end
  end

  defp render_table(repo, info_module, table_name, table_module) do
    info = table_module.info()

    columns =
      for %{name: name, type: type} <- info.columns, do: %{field: name, sortable: sortable(type)}

    searchable = for %{type: :string, name: name} <- info.columns, do: name

    table(
      id: :table_id,
      hint: info.title,
      limit: false,
      search: searchable != [],
      columns: columns,
      rows_name: "entries",
      row_fetcher: &row_fetcher(repo, info_module, table_name, searchable, &1, &2),
      title: Phoenix.Naming.humanize(table_name)
    )
  end

  defp sortable(:string), do: :asc
  defp sortable(_), do: :desc

  defp row_fetcher(repo, info_module, table_name, searchable, params, _node) do
    %{columns: columns, rows: rows} = info_module.query(table_name, repo, :raw)

    mapped =
      for row <- rows do
        columns
        |> Enum.zip(row)
        |> Map.new(fn {key, value} -> {String.to_atom(key), convert_value(value)} end)
      end

    %{search: search, sort_by: sort_by, sort_dir: sort_dir} = params

    mapped =
      if search do
        Enum.filter(mapped, fn map ->
          Enum.any?(searchable, &(Map.fetch!(map, &1) =~ search))
        end)
      else
        mapped
      end

    sorter = if sort_dir == :asc, do: &<=/2, else: &>=/2
    mapped = Enum.sort_by(mapped, &Map.fetch!(&1, sort_by), sorter)
    {mapped, length(rows)}
  end

  # Phoenix.HMTL.Safe may be not be implemented for Decimal
  # if PhoenixEcto is not available, so we handle it here.
  defp convert_value(%Decimal{} = decimal), do: Decimal.to_string(decimal)
  defp convert_value(value), do: value
end
