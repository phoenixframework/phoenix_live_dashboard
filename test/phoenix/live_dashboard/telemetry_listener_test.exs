defmodule Phoenix.LiveDashboard.TelemetryListenerTest do
  use ExUnit.Case, async: true

  import Telemetry.Metrics
  alias Phoenix.LiveDashboard.TelemetryListener

  test "forwards the given metrics" do
    time = System.system_time(:second)
    TelemetryListener.listen(node(), [counter("a.b.c"), counter("d.e.g")])

    :telemetry.execute([:a, :b], %{c: 100}, %{})
    assert_receive {:telemetry, [{0, nil, 100, event_time}]} when event_time >= time

    :telemetry.execute([:d, :e], %{g: 200}, %{})
    assert_receive {:telemetry, [{1, nil, 200, event_time}]} when event_time >= time
  end

  test "does not forward the metric if measurement is missing" do
    TelemetryListener.listen(node(), [counter("a.b.c")])

    :telemetry.execute([:a, :b], %{d: 100}, %{})
    :telemetry.execute([:a, :b], %{c: 200}, %{})
    assert_receive {:telemetry, [{0, nil, 200, _}]}
    refute_received {:telemetry, [{0, nil, 100, _}]}
  end

  test "does not forward the metric if measurement if skipping missing" do
    TelemetryListener.listen(node(), [counter("a.b.c", keep: & &1.keep?)])

    :telemetry.execute([:a, :b], %{c: 200}, %{keep?: false})
    :telemetry.execute([:a, :b], %{c: 100}, %{keep?: true})
    assert_receive {:telemetry, [{0, nil, 100, _}]}
    refute_received {:telemetry, [{0, nil, 200, _}]}
  end

  test "uses custom measurement" do
    TelemetryListener.listen(node(), [counter("a.b.c", measurement: &(&1.c * 2))])
    :telemetry.execute([:a, :b], %{c: 100}, %{})
    assert_receive {:telemetry, [{0, nil, 200, _}]}
  end

  test "converts tags and tag values to labels" do
    metric =
      counter("a.b.c", tag_values: &Map.put(&1, :extra, :tag), tags: [:given, :extra, :unknown])

    TelemetryListener.listen(node(), [metric])
    :telemetry.execute([:a, :b], %{c: 100}, %{given: "given"})
    assert_receive {:telemetry, [{0, "given tag", 100, _}]}
  end

  test "groups by event name" do
    TelemetryListener.listen(node(), [counter("a.b.c"), counter("a.b.d")])
    :telemetry.execute([:a, :b], %{c: 100, d: 200}, %{})
    assert_receive {:telemetry, [{0, nil, 100, time}, {1, nil, 200, time}]}
  end

  test "stops if the receiver process terminates" do
    parent = self()

    Task.start_link(fn ->
      {:ok, pid} = TelemetryListener.listen(node(), [counter("a.b.c")])
      send(parent, {:listener, pid})
    end)

    assert_receive {:listener, pid}
    ref = Process.monitor(pid)
    assert_receive {:DOWN, ^ref, _, _, _}
  end
end
