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
  @spec to_chart(metric :: Telemetry.Metrics.t()) :: Phoenix.LiveDashboard.Chart.t()
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

  @spec humanize_unit(Telemetry.Metrics.unit()) :: String.t()
  defp humanize_unit(:byte), do: " (bytes)"
  defp humanize_unit(:kilobyte), do: " (KB)"
  defp humanize_unit(:megabyte), do: " (MB)"
  defp humanize_unit(:nanosecond), do: " (ns)"
  defp humanize_unit(:microsecond), do: " (µs)"
  defp humanize_unit(:millisecond), do: " (ms)"
  defp humanize_unit(:second), do: " s"
  defp humanize_unit(:unit), do: ""
  defp humanize_unit(unit) when is_atom(unit), do: " #{unit}"
end
