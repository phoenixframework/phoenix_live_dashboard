defmodule Phoenix.LiveDashboard.SocketsLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.LiveHelpers

  alias Phoenix.LiveDashboard.SystemInfo
  alias Phoenix.LiveDashboard.TableComponent

  @page :sockets
  @table_id :table

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    {:ok, assign_mount(socket, @page, params, session, true)}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, socket |> assign_params(params) |> assign(:params, params)}
  end

  @impl true
  def render(assigns) do
    ~L"""
      <%= live_component(assigns.socket, TableComponent, table_assigns(@params, @menu.node)) %>
    """
  end

  defp table_assigns(params, node) do
    %{
      columns: columns(),
      id: @table_id,
      node: node,
      page_name: @page,
      params: params,
      row_attrs: &row_attrs/1,
      row_fetcher: &fetch_sockets/2
    }
  end

  defp fetch_sockets(params, node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_sockets(node, search, sort_by, sort_dir, limit)
  end

  defp columns() do
    [
      %{
        field: :port,
        header_attrs: [class: "pl-4"],
        format: &(&1[:port] |> encode_socket() |> String.trim_leading("Socket")),
        cell_attrs: [class: "tabular-column-name tabular-column-id pl-4"]
      },
      %{
        field: :module,
        sortable: true
      },
      %{
        field: :send_oct,
        header: "Sent",
        header_attrs: [class: "text-right pr-4"],
        format: &format_bytes(&1[:send_oct]),
        cell_attrs: [class: "tabular-column-bytes pr-4"],
        sortable: true
      },
      %{
        field: :recv_oct,
        header: "Received",
        header_attrs: [class: "text-right pr-4"],
        format: &format_bytes(&1[:recv_oct]),
        cell_attrs: [class: "tabular-column-bytes pr-4"],
        sortable: true
      },
      %{
        field: :local_address,
        header: "Local Address",
        sortable: true
      },
      %{
        field: :foreign_address,
        sortable: true
      },
      %{
        field: :state,
        sortable: true
      },
      %{
        field: :type,
        sortable: true
      },
      %{
        field: :connected,
        header: "Owner",
        format: &encode_pid(&1[:connected])
      }
    ]
  end

  defp row_attrs(socket) do
    [
      {"phx-click", "show_info"},
      {"phx-value-socket", encode_socket(socket[:port])},
      {"phx-page-loading", true}
    ]
  end

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: self_path(socket, node, socket.assigns.params))}
  end

  def handle_info(:refresh, socket) do
    %{params: params, menu: menu} = socket.assigns
    send_update(TableComponent, table_assigns(params, menu.node))
    {:noreply, socket}
  end

  @impl true
  def handle_event("show_info", %{"socket" => socket_info}, socket) do
    params = Map.put(socket.assigns.params, :info, socket_info)
    {:noreply, push_patch(socket, to: self_path(socket, node(), params))}
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, @page, node, params)
  end
end
