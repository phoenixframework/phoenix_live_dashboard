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
    time = System.system_time(:microsecond)

    entries =
      for {metric, index} <- metrics,
          map = extract_datapoint_for_metric(metric, measurements, metadata, time) do
        %{label: label, measurement: measurement, time: time} = map
        {index, label, measurement, time}
      end

    send(parent, {:telemetry, entries})
  end

  def extract_datapoint_for_metric(metric, measurements, metadata, time \\ nil) do
    if keep?(metric, metadata) do
      time = time || System.system_time(:microsecond)
      measurement = extract_measurement(metric, measurements, metadata)
      label = tags_to_label(metric, metadata)
      %{label: label, measurement: measurement, time: time}
    end
  end

  defp keep?(%{keep: keep}, metadata) when keep != nil, do: keep.(metadata)
  defp keep?(_metric, _metadata), do: true

  defp extract_measurement(metric, measurements, metadata) do
    case metric.measurement do
      fun when is_function(fun, 2) -> fun.(measurements, metadata)
      fun when is_function(fun, 1) -> fun.(measurements)
      key -> measurements[key]
    end
  end

  defp tags_to_label(%{tags: []}, _metadata), do: nil

  defp tags_to_label(%{tags: tags, tag_values: tag_values}, metadata) do
    tag_values = tag_values.(metadata)

    tags
    |> Enum.reduce([], fn tag, acc ->
      case tag_values do
        %{^tag => value} -> [to_string(value) | acc]
        %{} -> acc
      end
    end)
    |> Enum.reduce(&[&1, " " | &2])
    |> IO.iodata_to_binary()
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
