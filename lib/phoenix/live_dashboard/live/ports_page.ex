defmodule Phoenix.LiveDashboard.PortsPage do
  # TODO: This should be a behaviour?

  import Phoenix.LiveView
  import Phoenix.LiveView.Helpers
  import Phoenix.LiveDashboard.LiveHelpers

  alias Phoenix.LiveDashboard.SystemInfo
  alias Phoenix.LiveDashboard.TableComponent

  @page :ports
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
      row_fetcher: &fetch_ports/2
    }
  end

  defp fetch_ports(params, node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_ports(node, search, sort_by, sort_dir, limit)
  end

  defp columns() do
    [
      %{
        field: :port,
        header_attrs: [class: "pl-4"],
        cell_attrs: [class: "tabular-column-id pl-4"],
        format: &(&1[:port] |> encode_port() |> String.replace_prefix("Port", ""))
      },
      %{
        field: :name,
        header: "Name or path",
        cell_attrs: [class: "w-50"],
        format: &format_path(&1[:name])
      },
      %{
        field: :os_pid,
        header: "OS pid",
        format: &if(&1[:os_pid] != :undefined, do: &1[:os_pid])
      },
      %{
        field: :input,
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "tabular-column-bytes"],
        format: &format_bytes(&1[:input]),
        sortable: true
      },
      %{
        field: :output,
        header_attrs: [class: "text-right pr-4"],
        cell_attrs: [class: "tabular-column-bytes pr-4"],
        format: &format_bytes(&1[:output]),
        sortable: true
      },
      %{
        field: :id,
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "text-right"]
      },
      %{
        field: :owner,
        format: &inspect(&1[:connected])
      }
    ]
  end

  defp row_attrs(port) do
    [
      {"phx-click", "show_info"},
      {"phx-value-port", encode_port(port[:port])},
      {"phx-page-loading", true}
    ]
  end

  # @impl true
  def handle_event("show_info", %{"port" => port}, socket) do
    params = Map.put(socket.assigns.params, :info, port)
    {:noreply, push_patch(socket, to: self_path(socket, node(), params))}
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, @page, node, params)
  end
end
