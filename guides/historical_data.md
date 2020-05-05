# Configuring historical data

If you wish to populate metrics with current historical data saved from telemetry or another data source,
modify the dashboard config to include a historical_data key like so:

```elixir
live_dashboard "/dashboard",
    metrics: MyAppWeb.Telemetry,
    historical_data: %{
        [:namespace, :metric] =>
          {MyStorage, :historical_metric_data, []}
      }
```

where MyStorage is a module and historical_metric_data is a function taking a single argument in this example, which will always be a list of atoms equal to or starting with the key to the map, i.e. in this example `[:namespace, :metric]`.  The function must return a list, empty if there is no data, or a list of tuples of `{label, data, time}` where a nil label will default to the chart's label, and time should be
in `:native` time unit, such as from `System.system_time/0`.

As an example, you might be using [`:telemetry_poller`](https://github.com/beam-telemetry/telemetry_poller) to gather periodic_measurements that you accumulate between ticks in a GenServer.  The same GenServer may be modified to also store history, perhaps in a [circular buffer](https://en.wikipedia.org/wiki/Circular_buffer), as in the example below, and emit recent telemetry each time it is called by `:telemetry_poller`, but instead of clearing the history as it might do otherwise, append it to the end of a circular buffer structure to retain for a limited time period.  Here is an example of one such module serving both `:telemetry_poller` for measurements and `:historical_data` for metric history:

```elixir
defmodule MyStorage do
  use GenServer

  @raw_event_prefix [:namespace, :source]
  @historic_metrics [:namespace, :sink]
  @history_buffer_size 500

  def start_link([]) do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def init(_state) do
    {:ok, %{history: CircularBuffer.new(@history_buffer_size), current: %{}}}
  end

  def historical_metric_data(metric) do
    GenServer.call(__MODULE__, {:historical_metric_data, metric})
  end

  def setup do
    :telemetry.attach(
      "aggregation-handler-generic",
      @raw_event_prefix,
      &__MODULE__.handle_event/4,
      nil
    )
  end

  def handle_event(@raw_event_prefix, map, _metadata, nil) do
    GenServer.cast(__MODULE__, {:telemetry_metric, map})
  end

  def emit do
    GenServer.cast(__MODULE__, :emit_telemetry)
  end

  def handle_call({:historical_metric_data, metric}, _from, %{history: history} = state) do
    [:namespace, :sink, local_metric] = metric

    reply =
      for {time, time_metrics} <- history,
          {^local_metric, data} <- time_metrics do
        {nil, data, time}
      end

    {:reply, reply, state}
  end

  def handle_cast(:emit_telemetry, %{history: history, current: current}) do
    time = System.system_time(:second)

    for {key, value} <- current do
      :telemetry.execute(@historic_metrics, %{key => value})
    end

    {:noreply, %{history: CircularBuffer.insert(history, {time, current}), current: %{}}}
  end

  def handle_cast({:telemetry_metric, metric_map}, %{current: current} = state) do
    updated_current =
      for {key, value} <- metric_map, reduce: current do
        acc -> Map.put_new(acc, key, 0) |> update_in([key], &(&1 + value))
      end

    {:noreply, %{state | current: updated_current}}
  end
end
```