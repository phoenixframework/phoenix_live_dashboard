# Configuring metrics

This guide covers how to install and configure your LiveDashboard Metrics.

## Installing metrics

To enable the "Metrics" functionality in your dashboard, you will need to do the three steps below:

  1. Add the telemetry dependencies
  2. Define your telemetry module
  3. Configure the dashboard

### Add the telemetry dependencies

In your `mix.exs`, add the following to your `deps`:

```elixir
  {:telemetry_poller, "~> 0.4"},
  {:telemetry_metrics, "~> 0.4"},
```

If you generated your Phoenix app in version v1.5+, these dependencies will already be installed. You can also skip the next section.

### Define your telemetry module

In your Phoenix application, we recommend that you create a module to act as your telemetry supervision tree. Within this supervisor you can define your application's metrics and start your reporters.

The example below contains the child spec for a LiveDashboard reporter, as well as some metrics definitions for telemetry events emitted by Phoenix, Ecto, and the VM (via the `:telemetry_poller` package).

Create your Telemetry module in `lib/my_app_web/telemetry.ex`:

```elixir
defmodule MyAppWeb.Telemetry do
  use Supervisor
  import Telemetry.Metrics

  def start_link(arg) do
    Supervisor.start_link(__MODULE__, arg, name: __MODULE__)
  end

  def init(_arg) do
    children = [
      {:telemetry_poller, measurements: periodic_measurements(), period: 10_000}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end

  def metrics do
    [
      # Phoenix Metrics
      summary("phoenix.endpoint.stop.duration",
        unit: {:native, :millisecond}
      ),
      summary("phoenix.router_dispatch.stop.duration",
        tags: [:route],
        unit: {:native, :millisecond}
      ),

      # Database Time Metrics
      summary("my_app.repo.query.total_time", unit: {:native, :millisecond}),
      summary("my_app.repo.query.decode_time", unit: {:native, :millisecond}),
      summary("my_app.repo.query.query_time", unit: {:native, :millisecond}),
      summary("my_app.repo.query.queue_time", unit: {:native, :millisecond}),
      summary("my_app.repo.query.idle_time", unit: {:native, :millisecond}),

      # VM Metrics
      summary("vm.memory.total", unit: {:byte, :kilobyte}),
      summary("vm.total_run_queue_lengths.total"),
      summary("vm.total_run_queue_lengths.cpu"),
      summary("vm.total_run_queue_lengths.io")
    ]
  end

  defp periodic_measurements do
    []
  end
end
```

Make sure to replace `MyApp` and `my_app` by your actual application name.

Then add to your main application's supervision tree (usually in `lib/my_app/application.ex`):

```elixir
children = [
  MyApp.Repo,
  MyAppWeb.Telemetry,
  MyAppWeb.Endpoint,
  ...
]
```

### Configure the dashboard

The last step now is to configure the dashboard. Go to the `live_dashboard` call in your router and add the following option:

```elixir
live_dashboard "/dashboard", metrics: MyAppWeb.Telemetry
```

Now refresh the "/dashboard" page and the metrics functionality should be enabled. Each metric goes to a distinct group based on the metric name itself.

## More about telemetry

Now that you have metrics up and running, you can begin exploring the rest of the telemetry ecosystem! Here are a few links to get you started:

* The [`Telemetry.Metrics`](https://hexdocs.pm/telemetry_metrics)
  module documentation contains more information on:
  * Metric types
  * Breaking down metrics by tags
  * VM Metrics
  * Custom periodic polling

* For a deeper dive into Phoenix and Ecto metrics, see our
  [Telemetry Walkthrough](https://hexdocs.pm/phoenix/telemetry.html).

* For more Elixir libraries using `:telemetry`, see
  [Libraries using Telemetry](https://hexdocs.pm/phoenix/telemetry.html#libraries-using-telemetry).

## Configure Metrics

The LiveDashboard integrates with `:telemetry` converting each  `Telemetry.Metrics` to a beautiful, real-time chart.

The following table shows how `Telemetry.Metrics` metrics map to LiveDashboard charts:

| Telemetry.Metrics | Y-Axis Value(s)                                            |
|-------------------|----------------------------------------------------------- |
| `last_value`      | Always set to an absolute value                            |
| `counter`         | Always increased by 1                                      |
| `sum`             | Always increased/decreased by an absolute value            |
| `summary`         | Value/Min/Max/Avg                                          |
| `distribution`    | (Coming Soon) recording measurements in individual buckets |

### Reporter options

Reporter options can be given to each metric as an option. For example:

    counter("my_app.counter", reporter_options: [...])

The following reporter options are available to the dashboard:

  * `:group` - configures the group the metric belongs to. By default the group is the first part of the name. For example, `counter("my_app.counter")` defaults to group "my_app"
