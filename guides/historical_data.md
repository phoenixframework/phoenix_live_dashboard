# Configuring historical data

If you wish to populate metrics with current historical data saved from telemetry or another data source,
modify the dashboard config to include a historical_data key like so:

```elixir
live_dashboard "/dashboard",
    metrics: MyAppWeb.Telemetry,
    historical_data: {MyApp.MyStorage, :historical_data, []}
```

where MyStorage is a module and historical_metric_data is a function taking a single argument in this example, which will always be a metric.  The function must return a list, empty if there is no data, or a list of maps with `:label`, `:measurement` and `:time` keys in every map.  The measurement should be the output of `Phoenix.LiveDashboard.TelemetryListener.extract_measurement`
and the label should be the output of `Phoenix.LiveDashboard.TelemetryListener.tags_to_label`, and time should be in `:native` time unit with microsecond precision, such as from `System.system_time(:microsecond)`.

As an example, if you want history for all metrics. You can store history for those metrics, perhaps in a [circular buffer](https://en.wikipedia.org/wiki/Circular_buffer), as in the example below, and emit recent telemetry when each client connects and LiveDashboard calls into your module for historical data for the metrics on that tab.  If using this example you would also need to and add the module to your Application children, and initialize it with some or all of your metrics, such as from `MyAppWeb.Telemetry.metrics/0` . You could also store the data in an ETS table or in Redis or the database, or anywhere else, but for this example we'll show using a GenServer:

```elixir
  defmodule MyApp.MyStorage do
    use GenServer
    alias Phoenix.LiveDashboard.TelemetryListener

    @history_buffer_size 50

    def historical_data(metric) do
      GenServer.call(__MODULE__, {:data, metric})
    end

    def start_link(args) do
      GenServer.start_link(__MODULE__, args, name: __MODULE__)
    end

    @impl true
    def init(metrics) do
      Process.flag(:trap_exit, true)
      GenServer.cast(__MODULE__, {:metrics, metrics})
      {:ok, %{}}
    end

    @impl true
    def terminate(_, events) do
      for event <- events do
        :telemetry.detach({__MODULE__, event, self()})
      end

      :ok
    end

    defp attach_handler(%{name: name_list} = metric, id) do
      :telemetry.attach(
        "#{inspect(name_list)}-history-#{id}",
        Enum.slice(name_list, 0, length(name_list) - 1),
        &__MODULE__.handle_event/4,
        metric
      )
    end

    def handle_event(_event_name, data, metadata, metric) do
      measurement = TelemetryListener.extract_measurement(metric, data)
      label = TelemetryListener.tags_to_label(metric, metadata)
      GenServer.cast(__MODULE__, {:telemetry_metric, measurement, label, metric})
    end

    @impl true
    def handle_cast({:metrics, metrics}, _state) do
      metric_histories_map =
        metrics
        |> Enum.with_index()
        |> Enum.map(fn {metric, id} ->
          attach_handler(metric, id)
          {metric, CircularBuffer.new(@history_buffer_size)}
        end)
        |> Map.new()

      {:noreply, metric_histories_map}
    end

    @impl true
    def handle_cast({:telemetry_metric, measurement, label, metric}, state) do
      time = System.system_time(:microsecond)

      history = state[metric]

      new_history =
        CircularBuffer.insert(history, %{label: label, measurement: measurement, time: time})

      {:noreply, %{state | metric => new_history}}
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