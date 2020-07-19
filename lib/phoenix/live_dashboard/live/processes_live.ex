defmodule Phoenix.LiveDashboard.ProcessesLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.LiveHelpers

  alias Phoenix.LiveDashboard.SystemInfo
  alias Phoenix.LiveDashboard.TableComponent

  @page :processes
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
      <%= live_component(@socket, TableComponent, table_assigns(@params, @menu.node)) %>
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
      row_fetcher: &fetch_processes/2
    }
  end

  defp fetch_processes(params, node) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_processes(node, search, sort_by, sort_dir, limit)
  end

  defp columns() do
    [
      %{
        field: :pid,
        header: "PID",
        header_attrs: [class: "pl-4"],
        cell_attrs: [class: "tabular-column-id pl-4"],
        format: &(&1[:pid] |> encode_pid() |> String.replace_prefix("PID", ""))
      },
      %{
        field: :name_or_initial_call,
        header: "Name or initial call",
        cell_attrs: [class: "tabular-column-name"]
      },
      %{
        field: :memory,
        header: "Memory",
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "text-right"],
        sortable: true,
        format: &format_bytes(&1[:memory])
      },
      %{
        field: :reductions,
        header: "Reductions",
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "text-right"],
        sortable: true
      },
      %{
        field: :message_queue_len,
        header: "MsgQ",
        header_attrs: [class: "text-right"],
        cell_attrs: [class: "text-right"],
        sortable: true
      },
      %{
        field: :current_function,
        header: "Current function",
        cell_attrs: [class: "tabular-column-current"],
        format: &format_call(&1[:current_function])
      }
    ]
  end

  defp row_attrs(process) do
    [
      {"phx-click", "show_info"},
      {"phx-value-pid", encode_pid(process[:pid])},
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
  def handle_event("show_info", %{"pid" => pid}, socket) do
    params = Map.put(socket.assigns.params, :info, pid)
    {:noreply, push_patch(socket, to: self_path(socket, node(), params))}
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, @page, node, params)
  end
end
