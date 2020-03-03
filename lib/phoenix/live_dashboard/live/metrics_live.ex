defmodule Phoenix.LiveDashboard.MetricsLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.{Chart, ChartComponent}

  @impl true
  def mount(_, %{"metrics" => {mod, fun}}, socket) do
    Process.flag(:trap_exit, true)
    metrics = apply(mod, fun, [])
    charts = Enum.map(metrics, &Chart.from_metric/1)
    groups = Enum.group_by(charts, & &1.metric.event_name)
    channel = self()

    if connected?(socket) do
      for {event, charts} <- groups do
        id = {__MODULE__, event, channel}
        :telemetry.attach(id, event, &__MODULE__.handle_metrics/4, {charts, channel})
      end
    end

    {:ok, assign(socket, events: Map.keys(groups), charts: charts),
     temporary_assigns: [charts: []]}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="phx-dashboard-metrics-grid">
    <%= for chart <- @charts do %>
      <%= live_component @socket, ChartComponent, id: chart.id, chart: chart %>
    <% end %>
    </div>
    """
  end

  @doc false
  def handle_metrics(event_name, measurements, metadata, {charts, channel}) do
    send(channel, {event_name, measurements, metadata, charts})
  end

  @impl true
  def handle_info({_event_name, measurements, metadata, charts}, socket) do
    # generate a timestamp for timeseries x-axis
    time = DateTime.truncate(DateTime.utc_now(), :millisecond)

    for chart <- charts do
      with {x, y} <- Chart.label_measurement(chart, measurements, metadata) do
        send_update(ChartComponent, id: chart.id, data: [%{x: x, y: y, z: time}])
      end
    end

    {:noreply, socket}
  end

  @impl true
  def terminate(_, socket) do
    for event <- socket.assigns.events do
      :telemetry.detach({__MODULE__, event, self()})
    end

    :ok
  end
end
