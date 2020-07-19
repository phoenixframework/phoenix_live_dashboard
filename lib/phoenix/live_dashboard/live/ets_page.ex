defmodule Phoenix.LiveDashboard.EtsPage do
  # TODO: This should be a behaviour?

  import Phoenix.LiveView
  import Phoenix.LiveView.Helpers
  import Phoenix.LiveDashboard.LiveHelpers

  alias Phoenix.LiveDashboard.SystemInfo
  alias Phoenix.LiveDashboard.TableComponent

  @page :ets
  @table_id :table

  # @impl true
  def render(assigns) do
    ~L"""
      <%= live_component(assigns.socket, TableComponent, table_assigns(@params, @menu)) %>
    """
  end

  defp table_assigns(params, menu) do
    %{
      columns: columns(),
      id: @table_id,
      menu: menu,
      params: params,
      row_attrs: &row_attrs/1,
      row_fetcher: &fetch_ets/2,
      rows_name: "tables",
      title: "ETS"
    }
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
        sortable: true
      },
      %{
        field: :memory,
        cell_attrs: [class: "tabular-column-bytes"],
        format: &format_words(&1[:memory]),
        sortable: true
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
      {"phx-value-ets", encode_ets(table[:id])},
      {"phx-page-loading", true}
    ]
  end

  # @impl true
  def handle_event("show_info", %{"ets" => ets}, socket) do
    params = Map.put(socket.assigns.params, :info, ets)
    {:noreply, push_patch(socket, to: self_path(socket, node(), params))}
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, @page, node, params)
  end
end
