defmodule Phoenix.LiveDashboard.MenuLive do
  @moduledoc false
  use Phoenix.LiveView, container: {:nav, []}

  use Phoenix.LiveDashboard.Web, :view_helpers

  @impl true
  def mount(_, %{"menu" => menu}, socket) do
    socket = assign(socket, menu: menu, node: nil, nodes: nodes())
    socket = assign_node_or_redirect(socket, menu.node)

    if connected?(socket) and is_nil(socket.redirected) do
      :net_kernel.monitor_nodes(true, node_type: :all)
    end

    {:ok, socket}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <%= live_redirect "Home", to: live_dashboard_path(@socket, :index, [@node]) %> |
    <%= maybe_live_redirect @socket, "Metrics", :metrics, @node %>
    <%= maybe_live_redirect @socket, "Request Logger", :request_logger, @node %>
    <form phx-change="select_node" style="display:inline">
      Node: <%= select :node_selector, :node, @nodes, value: @node %>
    </form>
    """
  end

  defp maybe_live_redirect(socket, text, action, node) do
    cond do
      is_nil(socket.assigns.menu[action]) -> ""
      socket.assigns.menu.action == action -> [text | " | "]
      true -> [live_redirect(text, to: live_dashboard_path(socket, action, node)) | " | "]
    end
  end

  @impl true
  def handle_info({:nodeup, _, _}, socket) do
    {:noreply, assign(socket, nodes: nodes())}
  end

  def handle_info({:nodedown, _, _}, socket) do
    if socket.assigns.node not in nodes() do
      {:noreply,
       socket
       |> put_flash(:error, "Node #{socket.assigns.node} disconnected.")
       |> redirect_to_current_node()}
    else
      {:noreply, assign(socket, nodes: nodes())}
    end
  end

  @impl true
  def handle_event("select_node", params, socket) do
    {:noreply, assign_node_or_redirect(socket, params["node_selector"]["node"])}
  end

  defp nodes(), do: [node() | Node.list()]

  defp assign_node_or_redirect(socket, param_node) do
    node = Enum.find(nodes(), &(Atom.to_string(&1) == param_node))

    cond do
      is_nil(node) ->
        redirect_to_current_node(socket)

      is_nil(socket.assigns.node) ->
        assign(socket, node: node)

      node != socket.assigns.node ->
        send(socket.root_pid, {:node_redirect, node})
        socket

      true ->
        assign(socket, node: node)
    end
  end

  defp redirect_to_current_node(socket) do
    push_redirect(socket, to: live_dashboard_path(socket, :index, [node()]))
  end
end
