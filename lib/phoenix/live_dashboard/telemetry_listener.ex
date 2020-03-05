defmodule Phoenix.LiveDashboard.TelemetryListener do
  # This module is the one responsible for listening to
  # telemetry events and sending metrics from the given node.
  @moduledoc false
  use GenServer, restart: :temporary

  def listen(node, metrics) do
    DynamicSupervisor.start_child(
      {Phoenix.LiveDashboard.DynamicSupervisor, node},
      {__MODULE__, {self(), metrics}}
    )
  end

  def start_link({parent, metrics}) do
    GenServer.start_link(__MODULE__, {parent, metrics})
  end

  def handle_metrics(_event_name, measurements, metadata, {parent, metrics}) do
    time = System.system_time(:millisecond)

    entries =
      for {metric, index} <- metrics do
        if measurement = extract_measurement(metric, measurements) do
          label = metric |> extract_tags(metadata) |> tags_to_label()
          {index, label, measurement, time}
        end
      end

    send(parent, {:telemetry, entries})
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
    Enum.map_join(tags, " ", fn {_k, v} -> v end)
  end

  @impl true
  def init({parent, metrics}) do
    Process.flag(:trap_exit, true)
    ref = Process.monitor(parent)
    metrics = Enum.with_index(metrics, 0)
    metrics_per_event = Enum.group_by(metrics, fn {metric, _} -> metric.event_name end)

    for {event_name, metrics} <- metrics_per_event do
      id = {__MODULE__, event_name, self()}
      :telemetry.attach(id, event_name, &handle_metrics/4, {parent, metrics})
    end

    {:ok, %{ref: ref, events: Map.keys(metrics_per_event)}}
  end

  @impl true
  def handle_info({:DOWN, ref, _, _, _}, %{ref: ref} = state) do
    {:stop, :shutdown, state}
  end

  @impl true
  def terminate(_reason, %{events: events}) do
    for event <- events do
      :telemetry.detach({__MODULE__, event, self()})
    end

    :ok
  end
end
