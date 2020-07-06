# Configuring metrics history

If you wish to populate metrics with history saved from telemetry or another data source,
modify the dashboard config to include a metrics_history key like so:

```elixir
live_dashboard "/dashboard",
  metrics: MyAppWeb.Telemetry,
  metrics_history: {MyApp.MyStorage, :metrics_history, []}
```

where `MyStorage` is a module and `:metrics_history` is a function taking a single argument in this example, which will always be a metric.  The function must return a list, empty if there is no data, or a list of maps with `:label`, `:measurement` and `:time` keys in every map.  The function `Phoenix.LiveDashboard.extract_datapoint_for_metric/4` will return a map in exactly this format (with optional time argument if you want to override the default of `System.system_time(:microsecond)`), or it may return `nil` in which case the data point should not be saved.

As an example, if you want history for all metrics, you can store history for those metrics in a [circular buffer](https://en.wikipedia.org/wiki/Circular_buffer) and emit recent telemetry when each client connects. LiveDashboard calls into your module for history for the metrics on that tab.  You would also need to add the module to your Application children, and initialize it with some or all of your metrics, such as from `MyAppWeb.Telemetry.metrics/0` . You could store the data in an ETS table or in Redis or the database, or anywhere else, but for this example we'll show using a GenServer:

```elixir
  defmodule MyApp.MyStorage do
    use GenServer

    @history_buffer_size 50

    def metrics_history(metric) do
      GenServer.call(__MODULE__, {:data, metric})
    end

    def start_link(args) do
      GenServer.start_link(__MODULE__, args, name: __MODULE__)
    end

    @impl true
    def init(metrics) do
      Process.flag(:trap_exit, true)

      metric_histories_map =
        metrics
        |> Enum.map(fn metric ->
          attach_handler(metric)
          {metric, CircularBuffer.new(@history_buffer_size)}
        end)
        |> Map.new()

      {:ok, metric_histories_map}
    end

    @impl true
    def terminate(_, metrics) do
      for metric <- metrics do
        :telemetry.detach({__MODULE__, metric, self()})
      end

      :ok
    end

    defp attach_handler(%{name: name_list} = metric) do
      :telemetry.attach(
        {__MODULE__, metric, self()},
        Enum.slice(name_list, 0, length(name_list) - 1),
        &__MODULE__.handle_event/4,
        metric
      )
    end

    def handle_event(_event_name, data, metadata, metric) do
      if data = Phoenix.LiveDashboard.extract_datapoint_for_metric(metric, data, metadata) do
        GenServer.cast(__MODULE__, {:telemetry_metric, data, metric})
      end
    end

    @impl true
    def handle_cast({:telemetry_metric, data, metric}, state) do
      {:noreply, update_in(state[metric], &CircularBuffer.insert(&1, data))}
    end

    @impl true
    def handle_call({:data, metric}, _from, state) do
      if history = state[metric] do
        {:reply, CircularBuffer.to_list(history), state}
      else
        {:reply, [], state}
      end
    end
  end
```
