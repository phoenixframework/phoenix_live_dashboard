defmodule Phoenix.LiveDashboard.TelemetryLive do
  @moduledoc false
  use Phoenix.LiveView
  alias Phoenix.LiveDashboard.LiveMetric
  alias Phoenix.LiveDashboard.MetricConversion

  @impl true
  def mount(%{"name" => agent_name}, socket) do
    metrics = Agent.get(agent_name, & &1.metrics, 1_000)
    charts = Enum.map(metrics, &MetricConversion.to_chart/1)
    groups = Enum.group_by(charts, & &1.metric.event_name)
    channel = self()

    if connected?(socket) do
      for {event, charts} <- groups do
        id = {__MODULE__, event, channel}
        :telemetry.attach(id, event, &__MODULE__.handle_metrics/4, {charts, channel})
      end
    end

    {:ok, assign(socket, events: Map.keys(groups), charts: charts)}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <section id="phx-dashboard-telemetry-live">
      <div class="phx-dashboard-grid">
      <%= for chart <- @charts do %>
        <%= live_component @socket, LiveMetric, id: chart.id, chart: chart %>
      <% end %>
      </div>
    </section>
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

    for {chart, points} <- handle_points(charts, measurements, metadata, time) do
      send_update(LiveMetric, id: chart.id, data: points)
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

  defp handle_points(charts, values, meta, time) do
    for chart <- charts do
      {label, value} = MetricConversion.label_measurement(chart, values, meta)
      {chart, [%{x: label, y: value, z: time}]}
    end
  end
end
