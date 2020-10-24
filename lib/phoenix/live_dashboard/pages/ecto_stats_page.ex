defmodule Phoenix.LiveDashboard.EctoStatsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  @compile {:no_warn_undefined, [Decimal, EctoPSQLExtras]}
  @disabled_link "https://hexdocs.pm/phoenix_live_dashboard/ecto_stats.html"

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
      {:disabled, "Ecto Stats", @disabled_link}
    else
      :skip
    end
  end

  @impl true
  def menu_link(%{repo: repo}, capabilities) do
    title = "#{repo |> inspect() |> String.replace(".", " ")} Stats"
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
    for {table_name, table_module} <- info_module.queries(repo),
        table_name not in @forbidden_tables do
      {table_name,
       name: Phoenix.Naming.humanize(table_name),
       render: fn -> render_table(repo, info_module, table_name, table_module) end}
    end
  end

  defp render_table(repo, info_module, table_name, table_module) do
    info = table_module.info()

    columns =
      for %{name: name, type: type} <- info.columns do
        %{field: name, sortable: sortable(type), format: &format(type, &1)}
      end

    searchable = for %{type: :string, name: name} <- info.columns, do: name
    default_sort_by = with [{column, _} | _] <- info[:order_by], do: column

    table(
      id: :table_id,
      hint: info.title,
      limit: false,
      default_sort_by: default_sort_by,
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

  defp format(_, %struct{} = value) when struct in [Decimal, Postgrex.Interval],
    do: struct.to_string(value)

  defp format(:bytes, value) when is_integer(value),
    do: format_bytes(value)

  defp format(:percent, value) when is_number(value),
    do: value |> Kernel.*(100.0) |> Float.round(1) |> Float.to_string()

  defp format(_type, value),
    do: value
end
