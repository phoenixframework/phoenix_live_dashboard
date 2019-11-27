defmodule Phoenix.LiveDashboard.LiveMetricTest do
  use ExUnit.Case
  alias Phoenix.LiveDashboard.LiveMetric

  describe "from_telemetry/1" do
    setup _ do
      %{metric_name: "phoenix.endpoint.stop.duration"}
    end

    test "for counter", %{metric_name: metric_name} do
      assert %LiveMetric{metric: "counter"} =
               LiveMetric.from_telemetry(Telemetry.Metrics.counter(metric_name))
    end

    test "for sum", %{metric_name: metric_name} do
      assert %LiveMetric{metric: "sum"} =
               LiveMetric.from_telemetry(Telemetry.Metrics.sum(metric_name))
    end
  end
end
