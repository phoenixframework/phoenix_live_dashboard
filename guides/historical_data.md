# Configuring historical data

If you wish to populate metrics with current historical data saved from telemetry or another data source,
modify the dashboard config to include a historical_data key like so:

```elixir
live_dashboard "/dashboard",
    metrics: MyAppWeb.Telemetry,
    historical_data: {MyStorage, :historical_metric_data, []}
```

where MyStorage is a module and historical_metric_data is a function taking a single argument in this example, which will always be a metric.  The function must return a list, empty if there is no data, or a list of maps with `:label`, `:measurement` and `:time` keys in every map.  The measurement should be the output of `TelemetryListener.extract_measurement`
and the label should be the output of `TelemetryListener.tags_to_label`, and time should be in `:native` time unit with microsecond precision, such as from `System.system_time(:microsecond)`.

As an example, you might want history for the VM metrics. You can store history for those metrics, perhaps in a [circular buffer](https://en.wikipedia.org/wiki/Circular_buffer), as in the example below, and emit recent telemetry when each client connects and LiveDashboard calls into your moodule for historical data for the VM metrics.  If using this example you would also need to call setup_handlers/0 during Application start, and add the module to your Application children. You could also store the data in an ETS table or in Redis or the database, or anywhere else, but for this example we'll show using a GenServer:

```elixir
  defmodule MyStorage do
    use GenServer

    @run_queue_event [:vm, :total_run_queue_lengths]
    @memory_event [:vm, :memory]
    @history_buffer_size 50

    def start_link([]) do
      GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
    end

    def init(_state) do
      {:ok,
       %{
         total_run_queue_lengths: CircularBuffer.new(@history_buffer_size),
         memory: CircularBuffer.new(@history_buffer_size)
       }}
    end

    def data(metric, :total_run_queue_lengths) do
      GenServer.call(__MODULE__, {:data, metric, :total_run_queue_lengths})
    end

    def data(metric, :memory) do
      GenServer.call(__MODULE__, {:data, metric, :memory})
    end

    def data(_metric, _), do: []

    def setup_handlers do
      :telemetry.attach(
        "run-queue-handler",
        @run_queue_event,
        &__MODULE__.handle_event/4,
        nil
      )

      :telemetry.attach(
        "memory-handler",
        @memory_event,
        &__MODULE__.handle_event/4,
        nil
      )
    end

    def handle_event(@run_queue_event, metric_map, metadata, _config) do
      GenServer.cast(__MODULE__, {:telemetry_metric, metric_map, metadata, @run_queue_event})
    end

    def handle_event(@memory_event, metric_map, metadata, _config) do
      GenServer.cast(__MODULE__, {:telemetry_metric, metric_map, metadata, @memory_event})
    end

    def handle_call({:data, _metric, key}, _from, history) do
      {:reply, CircularBuffer.to_list(history[key]), history}
    end

    def handle_cast({:telemetry_metric, metric_map, metadata, event}, histories) do
      time = System.system_time(:second)
      key = List.last(event)

      new_history =
        CircularBuffer.insert(histories[key], %{
          data: metric_map,
          time: time,
          metadata: metadata
        })

      {:noreply, %{histories | key => new_history}}
    end
  end
```