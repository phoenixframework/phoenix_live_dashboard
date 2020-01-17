defmodule Phoenix.LiveDashboard.TelemetryLive do
  @moduledoc false
  use Phoenix.LiveView
  alias Phoenix.LiveDashboard
  alias Phoenix.LiveDashboard.LiveMetric

  @impl true
  def mount(_session, socket) do
    metrics = Agent.get(LiveDashboard, & &1.metrics, 1_000)
    groups = Enum.group_by(metrics, & &1.event_name)
    channel = self()

    if connected?(socket) do
      for {event, metrics} <- groups do
        id = {__MODULE__, event, channel}
        :telemetry.attach(id, event, &__MODULE__.handle_metrics/4, {metrics, channel})
      end
    end

    charts =
      for metric <- metrics,
          chart = LiveMetric.from_telemetry(metric),
          do: {chart.id, chart}

    {:ok, assign(socket, events: Map.keys(groups), charts: charts)}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <section id="phx-dashboard-telemetry-live">
      <div class="phx-dashboard-grid">
      <%= for {id, chart} <- @charts do %>
        <%= live_component @socket, LiveMetric, id: id, chart: chart  %>
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
  def handle_info({_event_name, measurements, metadata, metrics}, socket) do
    # generate a timestamp for timeseries x-axis
    received_at = DateTime.truncate(DateTime.utc_now(), :millisecond)

    {:noreply,
     assign(
       socket,
       :charts,
       Enum.reduce(metrics, socket.assigns.charts, fn metric, charts ->
         %LiveMetric{id: chart_id} = proto_chart = LiveMetric.from_telemetry(metric)

         # TODO: handle failures for measurements/tags
         measurement = extract_measurement(metric, measurements)
         label = metric |> extract_tags(metadata) |> tags_to_label() || chart_id

         # get all datasets for the given chart_id
         {_, %LiveMetric{datasets: datasets} = chart} =
           List.keyfind(charts, chart_id, 0, {chart_id, proto_chart})

         # get the dataset value for the given label
         {_, current_value} = List.keyfind(datasets, label, 0, {label, 0})

         # update the charts...
         # with the updated datasets...
         # with the updated datapoint.
         List.keyreplace(
           charts,
           chart_id,
           0,
           {chart_id,
            %LiveMetric{
              chart
              | datasets:
                  List.keystore(
                    datasets,
                    label,
                    0,
                    {label, next_value(chart, measurement, current_value, received_at)}
                  )
            }}
         )
       end)
     )}
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

  defp next_value(%LiveMetric{metric: metric}, measurement, current_value, received_at) do
    case metric do
      "last_value" -> measurement
      "counter" -> current_value + 1
      "sum" -> current_value + measurement
      "summary" -> {received_at, measurement}
    end
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
