defmodule Phoenix.LiveDashboard.MetricConversion do
  @moduledoc false

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
