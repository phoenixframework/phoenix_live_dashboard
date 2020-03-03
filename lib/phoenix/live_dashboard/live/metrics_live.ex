defmodule Phoenix.LiveDashboard.MetricsLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.{Chart, ChartComponent}

  @impl true
  def mount(%{"node" => param_node}, %{"metrics" => {mod, fun}}, socket) do
    metrics = apply(mod, fun, [])
    charts = Enum.map(metrics, &Chart.from_metric/1)
    socket = assign(socket, charts: charts, node: nil, nodes: nodes())
    socket = assign_node_or_redirect(socket, param_node)

    if connected?(socket) and is_nil(socket.redirected) do
      :net_kernel.monitor_nodes(true, node_type: :all)
      events = Enum.map(charts, & &1.metric.event_name)
      Phoenix.LiveDashboard.Listener.listen(socket.assigns.node, events)
    end

    {:ok, socket}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <form phx-change="change_node">
      Node: <%= select :metrics, :node, @nodes, value: @node, data: [phx_change: "hello"] %>
    </form>

    <div class="phx-dashboard-metrics-grid">
    <%= for chart <- @charts do %>
      <%= live_component @socket, ChartComponent, id: chart.id, chart: chart %>
    <% end %>
    </div>
    """
  end

  @impl true
  def handle_info({:nodeup, _, _}, socket), do: {:noreply, assign(socket, nodes: nodes())}
  def handle_info({:nodedown, _, _}, socket), do: {:noreply, assign(socket, nodes: nodes())}

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

  @impl true
  def handle_event("change_node", params, socket) do
    {:noreply, assign_node_or_redirect(socket, params["metrics"]["node"])}
  end

  defp nodes(), do: [node() | Node.list()]

  defp assign_node_or_redirect(socket, param_node) do
    node = param_node && Enum.find(nodes(), &(Atom.to_string(&1) == param_node))

    cond do
      is_nil(node) ->
        push_redirect(socket, to: live_dashboard_path(socket, :metrics, [node()]))

      is_nil(socket.assigns.node) ->
        assign(socket, node: node)

      node != socket.assigns.node ->
        push_redirect(socket, to: live_dashboard_path(socket, :metrics, [node]))

      true ->
        assign(socket, node: node)
    end
  end
end
