defmodule Phoenix.LiveDashboard.MetricsLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.ChartComponent

  @impl true
  def mount(%{"node" => param_node}, %{"metrics" => {mod, fun}}, socket) do
    metrics = apply(mod, fun, [])
    socket = assign(socket, metrics: Enum.with_index(metrics), node: nil, nodes: nodes())
    socket = assign_node_or_redirect(socket, param_node)

    if connected?(socket) and is_nil(socket.redirected) do
      :net_kernel.monitor_nodes(true, node_type: :all)
      Phoenix.LiveDashboard.Listener.listen(socket.assigns.node, metrics)
    end

    {:ok, socket}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <form phx-change="change_node">
      Node: <%= select :metrics, :node, @nodes, value: @node %>
    </form>

    <div class="phx-dashboard-metrics-grid">
    <%= for {metric, id} <- @metrics do %>
      <%= live_component @socket, ChartComponent, id: id, metric: metric %>
    <% end %>
    </div>
    """
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

  def handle_info({:telemetry, entries}, socket) do
    for {id, label, measurement, time} <- entries do
      data = [%{x: label, y: measurement, z: DateTime.from_unix!(time, :millisecond)}]
      send_update(ChartComponent, id: id, data: data)
    end

    {:noreply, socket}
  end

  @impl true
  def handle_event("change_node", params, socket) do
    {:noreply, assign_node_or_redirect(socket, params["metrics"]["node"])}
  end

  defp nodes(), do: [node() | Node.list()]

  defp assign_node_or_redirect(socket, param_node) do
    node = param_node && Enum.find(nodes(), &(Atom.to_string(&1) == param_node))

    cond do
      is_nil(node) ->
        redirect_to_current_node(socket)

      is_nil(socket.assigns.node) ->
        assign(socket, node: node)

      node != socket.assigns.node ->
        push_redirect(socket, to: live_dashboard_path(socket, :metrics, [node]))

      true ->
        assign(socket, node: node)
    end
  end

  defp redirect_to_current_node(socket) do
    push_redirect(socket, to: live_dashboard_path(socket, :metrics, [node()]))
  end
end
