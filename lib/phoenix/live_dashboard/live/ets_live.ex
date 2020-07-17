defmodule Phoenix.LiveDashboard.EtsLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.LiveHelpers

  alias Phoenix.LiveDashboard.SystemInfo
  alias Phoenix.LiveDashboard.TableComponent

  @page :ets
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
  def handle_event("show_info", %{"ets" => ets}, socket) do
    params = Map.put(socket.assigns.params, :info, ets)
    {:noreply, push_patch(socket, to: self_path(socket, node(), params))}
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, @page, node, params)
  end
end
