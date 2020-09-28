defmodule Phoenix.LiveDashboard.EtsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  alias Phoenix.LiveDashboard.SystemInfo

  @table_id :table
  @menu_text "ETS"

  @impl true
  def render_page(_assigns) do
    table(
      columns: columns(),
      id: @table_id,
      row_attrs: &row_attrs/1,
      row_fetcher: &fetch_ets/2,
      rows_name: "tables",
      title: "ETS"
    )
  end

  defp fetch_ets(params, node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_ets(node, search, sort_by, sort_dir, limit)
  end

  defp columns() do
    [
      %{
        field: :name,
        header: "Name or module",
        header_attrs: [class: "pl-4"],
        cell_attrs: [class: "tabular-column-name pl-4"]
      },
      %{
        field: :protection
      },
      %{
        field: :type
      },
      %{
        field: :size,
        cell_attrs: [class: "text-right"],
        sortable: :desc
      },
      %{
        field: :memory,
        cell_attrs: [class: "tabular-column-bytes"],
        format: &format_words(&1[:memory]),
        sortable: :desc
      },
      %{
        field: :owner,
        format: &encode_pid(&1[:owner])
      }
    ]
  end

  defp row_attrs(table) do
    [
      {"phx-click", "show_info"},
      {"phx-value-info", encode_ets(table[:id])},
      {"phx-page-loading", true}
    ]
  end

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end
end
