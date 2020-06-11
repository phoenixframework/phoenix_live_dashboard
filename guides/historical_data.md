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

As an example, if you want history for all metrics. You can store history for those metrics, perhaps in a [circular buffer](https://en.wikipedia.org/wiki/Circular_buffer), as in the example below, and emit recent telemetry when each client connects and LiveDashboard calls into your module for historical data for the metrics on that tab.  If using this example you would also need to and add the module to your Application children, and initialize it with some or all of your metrics, such as from `MyAppWeb.Telemetry.metrics/0` . You could also store the data in an ETS table or in Redis or the database, or anywhere else, but for this example we'll show using a GenServer:

```elixir
  defmodule DemoWeb.History do
    use GenServer
    alias Phoenix.LiveDashboard.TelemetryListener

    @history_buffer_size 50

    def data(metric) do
      GenServer.call(__MODULE__, {:data, metric})
    end

    def start_link(metrics) do
      GenServer.start_link(__MODULE__, metrics, name: __MODULE__)
    end

    def init(metrics) do
      {:ok,
        for metric <- metrics, reduce: %{} do
          acc ->
            key_metrics = Map.get(acc, event(metric.name), [])
            metric_map = %{metric: metric, history: CircularBuffer.new(@history_buffer_size)}
            attach_handler(metric, length(key_metrics))

            Map.merge(acc, %{event(metric.name) => [metric_map | key_metrics]})
        end}
    end

    defp attach_handler(%{name: name_list} = metric, id) do
      :telemetry.attach(
        "#{inspect(name_list)}-history-#{id}",
        event(name_list),
        &__MODULE__.handle_event/4,
        metric
      )
    end

    defp event(name_list) do
      Enum.slice(name_list, 0, length(name_list) - 1)
    end

    def handle_event(event_name, data, metadata, metric) do
      GenServer.cast(__MODULE__, {:telemetry_metric, event_name, data, metadata, metric})
    end

    def handle_cast({:telemetry_metric, event_name, data, metadata, metric}, state) do
      if histories_list = state[event_name] do
        time = System.system_time(:microsecond)

        {%{history: history}, index} =
          histories_list
          |> Enum.with_index()
          |> Enum.find(fn {map, _index} -> map.metric == metric end)

        measurement = TelemetryListener.extract_measurement(metric, data)
        label = TelemetryListener.tags_to_label(metric, metadata)

        new_history =
          CircularBuffer.insert(history, %{label: label, measurement: measurement, time: time})

        new_histories_list =
          List.replace_at(histories_list, index, %{metric: metric, history: new_history})

        {:noreply, %{state | event_name => new_histories_list}}
      else
        {:noreply, state}
      end
    end

    def handle_call({:data, metric}, _from, state) do
      if metric_map = state[event(metric.name)] do
        %{history: history} = Enum.find(metric_map, &(&1.metric == metric))
        {:reply, CircularBuffer.to_list(history), state}
      else
        {:reply, [], state}
      end
    end
  end
```