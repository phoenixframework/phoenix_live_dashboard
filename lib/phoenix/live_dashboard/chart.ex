defmodule Phoenix.LiveDashboard.Chart do
  @moduledoc false
  require Logger
  alias __MODULE__

  @enforce_keys [:id, :kind, :label, :metric]
  defstruct [:id, :kind, :label, :metric]

  @type t :: %Chart{
          id: String.t(),
          kind: atom,
          label: nil | String.t(),
          metric: Telemetry.Metrics.t()
        }

  @spec from_metric(metric :: Telemetry.Metrics.t()) :: Chart.t()
  def from_metric(%Telemetry.Metrics.Distribution{}) do
    raise ArgumentError, "LiveDashboard does not yet support distribution metrics"
  end

  def from_metric(%struct{} = metric) do
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
          chart :: t(),
          :telemetry.measurements(),
          :telemetry.metadata()
        ) :: {:ok, {label :: String.t(), measurement :: number()}} | :error | :missing
  def label_measurement(%Chart{} = chart, measurements, metadata) do
    %{id: id, metric: metric} = chart

    try do
      if measurement = extract_measurement(metric, measurements) do
        label = metric |> extract_tags(metadata) |> tags_to_label() || id
        {label, measurement}
      else
        :missing
      end
    rescue
      e ->
        Logger.error([
          "Could not format metric #{inspect(metric)}\n",
          Exception.format(:error, e, __STACKTRACE__)
        ])

        :error
    end
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
end
