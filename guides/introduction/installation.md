# Installation

> Note: LiveDashboard requires `Phoenix.LiveView`.
If LiveView is not already installed in your application,
please follow ALL of the instructions in the
[LiveView Installation](https://hexdocs.pm/phoenix_live_view/installation.html)
guide before continuing.

To start using LiveDashboard, add to your `mix.exs` and run
[`mix deps.get`](https://hexdocs.pm/mix/Mix.Tasks.Deps.Get.html):

```elixir
def deps do
  [
    {:telemetry_poller, "~> 0.4"},
    {:telemetry_metrics, "~> 0.4"},
    {:phoenix_live_dashboard, github: "phoenixframework/phoenix_live_dashboard"},
  ]
end
```

### Configuring the Router

Once installed, update your router's configuration to
`forward` requests to a LiveDashboard with a unique `name`
of your choosing:

```elixir
# lib/my_app_web/router.ex
use Phoenix.Router
import Phoenix.LiveView.Router
import Phoenix.LiveDashboard.Router

pipeline :browser do
  ...
  :fetch_live_flash
end

...

# LiveDashboard is only recommended in dev, for now :)
if Mix.env() == :dev do
  scope "/" do
    pipe_through :browser
    live_dashboard "/dashboard", MyAppWeb.Dashboard
  end
end
```

### Adding Telemetry

Before you can use LiveDashboard, you will need to define
the metrics that you wish to see rendered as real-time charts.

In your Phoenix application, we recommend that you create a
module to act as your telemetry supervision tree. Within
this supervisor you can define your application's metrics
and start your reporters.

The example below contains the child spec for a LiveDashboard
reporter, as well as some metrics definitions for telemetry
events emitted by Phoenix, Ecto, and the VM (via the
`:telemetry_poller` package).

Create your Telemetry module in `lib/my_app_web/telemetry.ex`:

```elixir
# lib/my_app_web/telemetry.ex
defmodule MyAppWeb.Telemetry do
  use Supervisor
  import Telemetry.Metrics

  def start_link(arg) do
    Supervisor.start_link(__MODULE__, arg, name: __MODULE__)
  end

  def init(_arg) do
    children = [
      {:telemetry_poller,
       measurements: periodic_measurements(),
       period: 10_000},
      {Phoenix.LiveDashboard, name: MyAppWeb.Dashboard, metrics: metrics()}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end

  defp metrics do
    [
      # Phoenix Metrics
      summary("phoenix.endpoint.stop.duration",
        tags: [:method, :request_path],
        tag_values: &tag_method_and_request_path/1,
        unit: {:native, :millisecond}
      ),
      counter("phoenix.endpoint.stop.duration",
        tags: [:method, :request_path],
        tag_values: &tag_method_and_request_path/1,
        unit: {:native, :millisecond}
      ),

      # Database Time Metrics
      summary("my_app.repo.query.total_time", unit: {:native, :millisecond}),
      summary("my_app.repo.query.decode_time", unit: {:native, :millisecond}),
      summary("my_app.repo.query.query_time", unit: {:native, :millisecond}),
      summary("my_app.repo.query.queue_time", unit: {:native, :millisecond}),

      # Periodic measurements from Repo
      last_value("demo.users.total"),
      summary("demo.users.total"),

      # VM Metrics
      summary("vm.memory.total", unit: {:byte, :kilobyte}),
      summary("vm.total_run_queue_lengths.total"),
      summary("vm.total_run_queue_lengths.cpu"),
      summary("vm.total_run_queue_lengths.io")
    ]
  end

  defp periodic_measurements do
    [
      {MyApp, :measure_users, []}
    ]
  end

  # Extracts labels like "GET /"
  defp tag_method_and_request_path(metadata) do
    Map.merge(metadata, Map.take(metadata.conn, [:method, :request_path]))
  end
end
```

Then add to your main application's supervision tree (usually
in `lib/my_app/application.ex`):

```elixir
children = [
  # Start the telemetry supervisor
  MyAppWeb.Telemetry,
  # Start the endpoint when the application starts
  MyAppWeb.Endpoint,
  ...
]
```

Finally, start the Phoenix server:

```elixir
mix phx.server
```

And visit the LiveDashboard at
[`localhost:4000/dashboard`](http://localhost:4000/dashboard).

### Learning More

Now that you are up and running with LiveDashboard, you can
begin exploring the rest of the telemetry ecosystem! Here are
a few links to get you started:

* The [`Telemetry.Metrics`](https://hexdocs.pm/telemetry_metrics)
  module documentation contains more information on:
  * Metric types
  * Breaking down metrics by tags
  * VM Metrics
  * Custom periodic polling

* For a deeper dive into Phoenix and Ecto metrics, see our
  [Telemetry Walkthrough](telemetry.html).

* For more Elixir libraries using `:telemetry`, see
  [Libraries using Telemetry](telemetry.html#libraries-using-telemetry).

Happy coding!
