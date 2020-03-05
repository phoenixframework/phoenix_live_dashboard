defmodule Phoenix.LiveDashboard.MenuLive do
  @moduledoc false
  use Phoenix.LiveView, container: {:nav, []}

  use Phoenix.LiveDashboard.Web, :view_helpers

  @impl true
  def mount(_, %{"menu" => menu}, socket) do
    socket = assign(socket, menu: menu, node: menu.node)
    socket = validate_nodes_or_redirect(socket)

    if connected?(socket) and is_nil(socket.redirected) do
      :net_kernel.monitor_nodes(true, node_type: :all)
    end

    {:ok, socket}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <%= maybe_active_live_redirect @socket, "Home", :home, @node %> |
    <%= maybe_enabled_live_redirect @socket, "Metrics", :metrics, @node %> |
    <%= maybe_enabled_live_redirect @socket, "Request Logger", :request_logger, @node %> |
    <form phx-change="select_node" style="display:inline">
      Node: <%= select :node_selector, :node, @nodes, value: @node %>
    </form>
    """
  end

  defp maybe_active_live_redirect(socket, text, action, node) do
    if socket.assigns.menu.action == action do
      text
    else
      live_redirect(text, to: live_dashboard_path(socket, action, node))
    end
  end

  defp maybe_enabled_live_redirect(socket, text, action, node) do
    if socket.assigns.menu[action] do
      maybe_active_live_redirect(socket, text, action, node)
    else
      ~E"""
      <%= text %> (<%= link "enable", to: guide(action) %>)
      """
    end
  end

  defp guide(name), do: "https://hexdocs.pm/phoenix_live_dashboard/#{name}.html"

  @impl true
  def handle_info({:nodeup, _, _}, socket) do
    {:noreply, assign(socket, nodes: nodes())}
  end

  def handle_info({:nodedown, _, _}, socket) do
    {:noreply, validate_nodes_or_redirect(socket)}
  end

  @impl true
  def handle_event("select_node", params, socket) do
    param_node = params["node_selector"]["node"]

    if node = Enum.find(nodes(), &(Atom.to_string(&1) == param_node)) do
      send(socket.root_pid, {:node_redirect, node})
      {:noreply, socket}
    else
      {:noreply, redirect_to_current_node(socket)}
    end
  end

  defp nodes(), do: [node() | Node.list()]

  defp validate_nodes_or_redirect(socket) do
    if socket.assigns.node not in nodes() do
      socket
      |> put_flash(:error, "Node #{socket.assigns.node} disconnected.")
      |> redirect_to_current_node()
    else
      assign(socket, nodes: nodes())
    end
  end

  defp redirect_to_current_node(socket) do
    push_redirect(socket, to: live_dashboard_path(socket, :home, node()))
  end
end
