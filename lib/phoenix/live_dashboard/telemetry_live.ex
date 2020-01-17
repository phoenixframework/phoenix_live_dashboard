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
  def handle_metrics(event_name, measurements, metadata, {metrics, channel}) do
    send(channel, {event_name, measurements, metadata, metrics})
  end

  @impl true
  def handle_info({_event_name, measurements, metadata, charts}, socket) do
    # generate a timestamp for timeseries x-axis
    received_at = DateTime.truncate(DateTime.utc_now(), :millisecond)

    for chart <- charts do
      %{metric: metric} = chart
      # TODO: handle failures for measurements/tags
      measurement = extract_measurement(metric, measurements)
      label = metric |> extract_tags(metadata) |> tags_to_label() || chart.id

      send_update(LiveMetric,
        id: chart.id,
        data: [
          %{
            x: label,
            y: measurement,
            z: received_at
          }
        ]
      )
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

  defp extract_measurement(metric, measurements) do
    case metric.measurement do
      fun when is_function(fun, 1) -> fun.(measurements)
      key -> measurements[key]
    end
  end

  defp extract_tags(metric, metadata) do
    tag_values = metric.tag_values.(metadata)
    Map.take(tag_values, metric.tags)
  end

  defp tags_to_label(tags) when tags == %{}, do: nil

  defp tags_to_label(tags) when is_map(tags) do
    tags
    |> Enum.reduce([], fn {_k, v}, acc -> [to_string(v) | acc] end)
    |> Enum.reverse()
    |> Enum.intersperse(?\s)
    |> IO.iodata_to_binary()
  end
end
