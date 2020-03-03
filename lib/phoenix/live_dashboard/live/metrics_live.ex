defmodule Phoenix.LiveDashboard.MetricsLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.ChartComponent

  @impl true
  def mount(%{"node" => node}, %{"metrics" => {mod, fun}}, socket) do
    metrics = apply(mod, fun, [])

    if connected?(socket) do
      Phoenix.LiveDashboard.Listener.listen(find_node!(node), metrics)
      :net_kernel.monitor_nodes(true, node_type: :all)
    end

    {:ok, assign(socket, node: node, metrics: Enum.with_index(metrics))}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="phx-dashboard-metrics-grid">
    <%= for {metric, id} <- @metrics do %>
      <%= live_component @socket, ChartComponent, id: id, metric: metric %>
    <% end %>
    </div>
    """
  end

  @impl true
  def handle_info({:telemetry, entries}, socket) do
    for {id, label, measurement, time} <- entries do
      data = [%{x: label, y: measurement, z: DateTime.from_unix!(time, :millisecond)}]
      send_update(ChartComponent, id: id, data: data)
    end

    {:noreply, socket}
  end

  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: live_dashboard_path(socket, :metrics, node))}
  end

  defp find_node!(param_node) do
    Enum.find([node() | Node.list()], &(Atom.to_string(&1) == param_node)) ||
      raise "could not find #{param_node}"
  end
end
