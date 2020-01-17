defmodule Phoenix.LiveDashboard.MetricConversionTest do
  use ExUnit.Case, async: true
  import Telemetry.Metrics
  alias Phoenix.LiveDashboard.{Chart, MetricConversion}

  describe "to_chart/1" do
    test "with Distribution, raises with not yet supported message" do
      assert_raise ArgumentError, "LiveDashboard does not yet support distribution metrics", fn ->
        MetricConversion.to_chart(distribution("a.b.c", buckets: [10, 20, 30]))
      end
    end

    test "metric" do
      metric = counter("a.b.c")
      assert %Chart{} = chart = MetricConversion.to_chart(metric)
      assert chart.metric == metric
    end

    test "id and kind" do
      metric_name = "phoenix.endpoint.stop.duration"

      # Counter
      assert %Chart{} = chart = MetricConversion.to_chart(counter(metric_name))
      assert chart.id == "phoenix-endpoint-stop-duration-counter"
      assert chart.kind == :counter

      # LastValue
      chart = MetricConversion.to_chart(last_value(metric_name))
      assert chart.id == "phoenix-endpoint-stop-duration-last_value"
      assert chart.kind == :last_value

      # Sum
      chart = MetricConversion.to_chart(sum(metric_name))
      assert chart.id == "phoenix-endpoint-stop-duration-sum"
      assert chart.kind == :sum

      # Summary
      chart = MetricConversion.to_chart(summary(metric_name))
      assert chart.id == "phoenix-endpoint-stop-duration-summary"
      assert chart.kind == :summary
    end

    test "label" do
      chart = MetricConversion.to_chart(sum("phoenix.endpoint.stop.duration"))
      assert chart.label == "Duration"

      chart = MetricConversion.to_chart(last_value("vm.memory.total"))
      assert chart.label == "Total"
    end

    test "labels with units" do
      for {unit, suffix} <- [
            nanosecond: "(ns)",
            microsecond: "(µs)",
            millisecond: "(ms)",
            second: "s"
          ] do
        chart =
          MetricConversion.to_chart(sum("phoenix.endpoint.stop.duration", unit: {:native, unit}))

        assert chart.label == "Duration #{suffix}"
      end

      for {unit, suffix} <- [
            byte: "(bytes)",
            kilobyte: "(KB)",
            megabyte: "(MB)",
            user: "user",
            defined: "defined",
            atoms: "atoms"
          ] do
        chart = MetricConversion.to_chart(summary("vm.memory.total", unit: unit))

        assert chart.label == "Total #{suffix}"
      end
    end
  end
end
