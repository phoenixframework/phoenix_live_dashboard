defmodule Phoenix.LiveDashboard do
  @external_resource "README.md"
  @moduledoc @external_resource
             |> File.read!()
             |> String.split("<!-- MDOC !-->")
             |> Enum.fetch!(1)

  @doc """
  Extracts a datapoint for the given metric.

  Receives a `Telemetry.Metric` as `metric`, alongside the `measurements`
  and `metadata` from the Telemetry event, and an optional `time` and
  returns an extracted datapoint or `nil` if the event is not part of
  the metric.

  Note that it is expected that the event name was already validated as
  part of the metric.
  """
  @spec extract_datapoint_for_metric(Telemetry.Metric.t(), map(), map(), pos_integer | nil) ::
          %{label: binary(), measurement: number, time: pos_integer} | nil
  defdelegate extract_datapoint_for_metric(metric, measurements, metadata, time \\ nil),
    to: Phoenix.LiveDashboard.TelemetryListener
end
