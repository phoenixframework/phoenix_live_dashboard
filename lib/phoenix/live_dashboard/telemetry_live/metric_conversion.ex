defmodule Phoenix.LiveDashboard.Chart do
  @moduledoc false

  @enforce_keys [:id, :kind, :metric]
  defstruct [
    :id,
    :kind,
    :label,
    :metric
  ]

  @type t :: %__MODULE__{
          id: String.t(),
          kind: atom,
          label: nil | String.t(),
          metric: Telemetry.Metrics.t()
        }
end

defmodule Phoenix.LiveDashboard.MetricConversion do
  @moduledoc false
  alias Phoenix.LiveDashboard.Chart

  @spec to_chart(metric :: Telemetry.Metrics.t()) :: Chart.t()
  def to_chart(%Telemetry.Metrics.Distribution{}) do
    raise ArgumentError, "LiveDashboard does not yet support distribution metrics"
  end

  def to_chart(%struct{} = metric) do
    %Phoenix.LiveDashboard.Chart{
      id: id(metric),
      kind: kind(struct),
      label: label(metric),
      metric: metric
    }
  end

  # Returns the DOM ID for the chart on the dashboard.
  defp id(%struct{} = metric) do
    [metric.name, metric.tags, kind(struct)]
    |> Enum.flat_map(&List.wrap/1)
    |> Enum.join("-")
  end

  defp kind(Telemetry.Metrics.Counter), do: :counter
  defp kind(Telemetry.Metrics.Distribution), do: :distribution
  defp kind(Telemetry.Metrics.LastValue), do: :last_value
  defp kind(Telemetry.Metrics.Sum), do: :sum
  defp kind(Telemetry.Metrics.Summary), do: :summary

  defp label(%_struct{} = metric) do
    metric.name
    |> List.last()
    |> Phoenix.Naming.humanize()
    |> Kernel.<>("#{humanize_unit(metric.unit)}")
  end

  defp humanize_unit(:byte), do: " (bytes)"
  defp humanize_unit(:kilobyte), do: " (KB)"
  defp humanize_unit(:megabyte), do: " (MB)"
  defp humanize_unit(:nanosecond), do: " (ns)"
  defp humanize_unit(:microsecond), do: " (µs)"
  defp humanize_unit(:millisecond), do: " (ms)"
  defp humanize_unit(:second), do: " s"
  defp humanize_unit(:unit), do: ""
  defp humanize_unit(unit) when is_atom(unit), do: " #{unit}"

  @spec label_measurement(
          chart :: Chart.t(),
          :telemetry.measurements(),
          :telemetry.metadata()
        ) ::
          {label :: String.t(), measurement :: nil | number()}
  def label_measurement(%Chart{} = chart, measurements, metadata) do
    # TODO: handle failures for measurements/tags
    %{id: id, metric: metric} = chart
    measurement = extract_measurement(metric, measurements)
    label = metric |> extract_tags(metadata) |> tags_to_label() || id

    {label, measurement}
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
