defmodule Phoenix.LiveDashboard.MetricConversionTest do
  use ExUnit.Case, async: true
  import ExUnit.CaptureLog
  import Telemetry.Metrics
  alias Phoenix.LiveDashboard.{Chart, MetricConversion}

  describe "to_chart/1" do
    test "with Distribution, raises with not yet supported message" do
      assert_raise ArgumentError, "LiveDashboard does not yet support distribution metrics", fn ->
        MetricConversion.to_chart(distribution("a.b.c", buckets: [10, 20, 30]))
      end
    end

    test "new chart" do
      assert MetricConversion.to_chart(counter("a.b.c")) ==
               new_chart("a.b.c", :counter)
    end

    test "metric" do
      metric = counter("a.b.c")
      assert %Chart{} = chart = MetricConversion.to_chart(metric)
      assert chart.metric == metric
    end

    test "id and kind" do
      metric_name = "phoenix.endpoint.stop.duration"

      for kind <- [:counter, :last_value, :sum, :summary] do
        chart = new_chart(metric_name, kind)
        assert chart.id == "phoenix-endpoint-stop-duration-#{kind}"
        assert chart.kind == kind
      end
    end

    test "label" do
      chart = new_chart("phoenix.endpoint.stop.duration", :counter)
      assert chart.label == "Duration"

      chart = new_chart("vm.memory.total", :last_value)
      assert chart.label == "Total"
    end

    test "labels with units" do
      for {unit, suffix} <- [
            nanosecond: "(ns)",
            microsecond: "(µs)",
            millisecond: "(ms)",
            second: "s"
          ] do
        chart = new_chart("phoenix.endpoint.stop.duration", :counter, unit: {:native, unit})
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
        chart = new_chart("vm.memory.total", :counter, unit: unit)
        assert chart.label == "Total #{suffix}"
      end
    end
  end

  describe "label_measurement/3" do
    test "measurement from key" do
      assert {:ok, {"phoenix-endpoint-stop-duration-counter", 1}} ==
               MetricConversion.label_measurement(
                 new_chart("phoenix.endpoint.stop.duration", :counter),
                 %{duration: 1},
                 %{}
               )

      assert {:ok, {"vm-memory-total-last_value", 1024}} ==
               MetricConversion.label_measurement(
                 new_chart("vm.memory.total", :last_value),
                 %{
                   total: 1024
                 },
                 %{}
               )
    end

    test "measurement from callback" do
      assert {:ok, {"test-measurement-callback-counter", 3}} ==
               MetricConversion.label_measurement(
                 new_chart("test.measurement.callback", :counter,
                   measurement: &sum_all_measurements/1
                 ),
                 %{
                   a: 1,
                   b: 1,
                   c: 1
                 },
                 %{}
               )
    end

    test "logs bad measurements" do
      log =
        capture_log(fn ->
          assert :error ==
                   MetricConversion.label_measurement(
                     new_chart("endpoint.stop.duration", :summary,
                       tag_values: fn %{foo: :bar} -> %{bar: :baz} end,
                       tags: [:bar]
                     ),
                     %{duration: 100},
                     %{bar: :baz}
                   )
        end)

      assert log =~ "Could not format metric %Telemetry.Metrics.Summary"
      assert log =~ "** (FunctionClauseError) no function clause matching"
    end

    test "label from tags" do
      # key in metadata
      assert {:ok, {"foo", 1}} ==
               MetricConversion.label_measurement(
                 new_chart("test.tags.duration", tags: [:name]),
                 %{duration: 1},
                 %{name: :foo}
               )

      # multiple keys
      assert {:ok, {"GET /dashboard", 0.001}} ==
               MetricConversion.label_measurement(
                 new_chart("http.request.stop.duration", tags: [:method, :path]),
                 %{duration: 0.001},
                 %{method: "GET", path: "/dashboard"}
               )

      # nonexistent keys
      assert {:ok, {"test-tags-duration-with-invalid-keys-last_value", 1}} ==
               MetricConversion.label_measurement(
                 new_chart("test.tags.duration", tags: [:with, :invalid, :keys]),
                 %{duration: 1},
                 %{name: :foo}
               )

      # mixed existence keys
      assert {:ok, {"foo", 1}} ==
               MetricConversion.label_measurement(
                 new_chart("test.tags.duration", tags: [:a, :b, :c]),
                 %{duration: 1},
                 %{b: "foo"}
               )
    end

    test "label from tag values" do
      assert {:ok, {"GET /dashboard", 0.001}} ==
               MetricConversion.label_measurement(
                 new_chart("http.request.stop.duration",
                   tags: [:method, :request_path],
                   tag_values: &take_method_and_path_from_conn/1
                 ),
                 %{duration: 0.001},
                 %{conn: Phoenix.ConnTest.build_conn(:get, "/dashboard")}
               )

      assert {:ok, {"GET", 0.001}} ==
               MetricConversion.label_measurement(
                 new_chart("http.request.stop.duration",
                   tags: [:method, :invalid_key],
                   tag_values: &take_method_and_path_from_conn/1
                 ),
                 %{duration: 0.001},
                 %{conn: Phoenix.ConnTest.build_conn(:get, "/dashboard")}
               )
    end
  end

  # Chart helpers

  defp new_chart(event_name, opts) when is_list(opts) do
    new_chart(event_name, :last_value, opts)
  end

  defp new_chart(event_name, metric) when is_atom(metric) do
    new_chart(event_name, metric, [])
  end

  defp new_chart(event_name, metric, opts)
       when is_atom(metric) and is_list(opts) do
    Telemetry.Metrics
    |> apply(metric, [event_name, opts])
    |> MetricConversion.to_chart()
  end

  # Telemetry.Metrics callbacks

  defp sum_all_measurements(measurements) when is_map(measurements) do
    Enum.reduce(measurements, 0, fn {_k, v}, acc -> acc + v end)
  end

  defp take_method_and_path_from_conn(%{conn: conn}) do
    Map.take(conn, [:method, :request_path])
  end
end
