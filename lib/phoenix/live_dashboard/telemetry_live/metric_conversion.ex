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

  def label(%_struct{} = metric) do
    metric.name
    |> List.last()
    |> Phoenix.Naming.humanize()
    |> Kernel.<>("#{humanize_unit(metric.unit)}")
  end

  def metric(Telemetry.Metrics.Counter), do: "counter"
  def metric(Telemetry.Metrics.Distribution), do: "distribution"
  def metric(Telemetry.Metrics.LastValue), do: "last_value"
  def metric(Telemetry.Metrics.Sum), do: "sum"
  def metric(Telemetry.Metrics.Summary), do: "summary"

  @spec humanize_unit(Telemetry.Metrics.unit()) :: String.t()
  def humanize_unit(:byte), do: " (bytes)"
  def humanize_unit(:kilobyte), do: " (KB)"
  def humanize_unit(:megabyte), do: " (MB)"
  def humanize_unit(:nanosecond), do: " (ns)"
  def humanize_unit(:microsecond), do: " (µs)"
  def humanize_unit(:millisecond), do: " (ms)"
  def humanize_unit(:second), do: " s"
  def humanize_unit(:unit), do: ""
  def humanize_unit(unit) when is_atom(unit), do: " #{unit}"
end
