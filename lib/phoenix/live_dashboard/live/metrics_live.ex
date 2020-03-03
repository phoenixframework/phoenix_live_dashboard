defmodule Phoenix.LiveDashboard.MetricsLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.{Chart, ChartComponent}

  @impl true
  def mount(params, %{"metrics" => {mod, fun}}, socket) do
    metrics = apply(mod, fun, [])
    charts = Enum.map(metrics, &Chart.from_metric/1)
    node = find_node(params["node"]) || node()

    if connected?(socket) do
      events = Enum.map(charts, & &1.metric.event_name)
      Phoenix.LiveDashboard.Listener.listen(node, self(), events)
    end

    {:ok, assign(socket, charts: charts, node: node)}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <form phx-change="change_node">
      Node: <%= select :metrics, :node, nodes(), value: @node, data: [phx_change: "hello"] %>
    </form>

    <div class="phx-dashboard-metrics-grid">
    <%= for chart <- @charts do %>
      <%= live_component @socket, ChartComponent, id: chart.id, chart: chart %>
    <% end %>
    </div>
    """
  end

  @impl true
  def handle_info({event_name, measurements, metadata}, socket) do
    # generate a timestamp for timeseries x-axis
    time = DateTime.truncate(DateTime.utc_now(), :millisecond)

    for chart <- socket.assigns.charts,
        chart.metric.event_name == event_name do
      with {x, y} <- Chart.label_measurement(chart, measurements, metadata) do
        send_update(ChartComponent, id: chart.id, data: [%{x: x, y: y, z: time}])
      end
    end

    {:noreply, socket}
  end

  def handle_event("change_node", params, socket) do
    node = find_node(params["metrics"]["node"])

    if node && node != socket.assigns.node do
      {:noreply, push_redirect(socket, to: live_dashboard_path(socket, :metrics, [node]))}
    else
      {:noreply, socket}
    end
  end

  defp nodes(), do: [node() | Node.list()]

  defp find_node(user_node) do
    user_node && Enum.find(nodes(), &Atom.to_string(&1) == user_node)
  end
end
