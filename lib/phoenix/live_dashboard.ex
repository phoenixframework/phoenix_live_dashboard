defmodule Phoenix.LiveDashboard do
  @moduledoc ~S"""
  LiveDashboard provides real-time performance monitoring
  and debugging tools for Phoenix developers.

  ## Built-in features

    * Debugging - (Coming soon)

    * Performance monitoring - See how your application
      performs under different conditions by visualizing
      [`:telemetry`](https://hexdocs.pm/telemetry) events
      with real-time charts. See [Telemetry](#module-telemetry).

  ## The LiveView Dashboard

  In order to use LiveDashboard, you need to:

    1. Install `Phoenix.LiveView` in your application
    1. Define your Telemetry metrics
    1. Forward requests to LiveDashboard

  ### Example

  To start a LiveDashboard, add your LiveDashboard reporter
  to your Telemetry supervision tree (usually in
  `lib/my_app_web/telemetry.ex`):

      children = [
        {Phoenix.LiveDashboard, name: MyAppWeb.Dashboard, metrics: metrics()}
      ]

      Supervisor.start_link(children, strategy: :one_for_one)

  With two options:

  * `:name` - A unique name for your LiveDashboard.

  * `:metrics` - A list of [`Telemetry.Metrics`](`t:Telemetry.Metrics.t/0`)
    structs. Each metric will be rendered as a chart on the
    dashboard.

  Here are some example metrics from the Phoenix framework
  that you can use to get started:

      defp metrics do
        [
          # Phoenix Metrics
          Telemetry.Metrics.counter("phoenix.endpoint.stop.duration")
          Telemetry.Metrics.summary("phoenix.endpoint.stop.duration", unit: {:native, :millisecond})
        ]
      end

  > Read the [Telemetry Walkthrough](telemetry.html) for
  more information on how to configure metrics.

  Then, to access the dashboard, you can `forward` requests
  to LiveDashboard from your `Phoenix.Router` (usually in
  `lib/my_app_web/router.ex`).

  Remember to use the same `name` you gave to your
  LiveDashboard reporter:

      # LiveDashboard is only recommended in dev, for now :)
      if Mix.env() == :dev do
        scope "/" do
          pipe_through :browser
          forward "/dashboard", Phoenix.LiveDashboard, name: MyAppWeb.Dashboard
        end
      end

  ## Telemetry

  LiveDashboard integrates with `Telemetry.Metrics` to
  render your application metrics as beatiful, real-time
  charts.

  ### Translation from Telemetry.Metrics to LiveDashboard

  The following table shows how `Telemetry.Metrics` metrics
  map to LiveDashboard charts:

  | Telemetry.Metrics | Chart |
  |-------------------|-------|
  | `last_value`      | `Doughnut`, always set to an absolute value |
  | `counter`         | `Doughnut`, always increased by 1 |
  | `summary`         | `Line`, recording individual measurement using time scale |
  | `distribution`    | (Coming Soon) `Line`, recording measurement in individual buckets using time scale |
  """
  use Phoenix.Router
  use Agent

  alias Phoenix.LiveDashboard

  def start_link(opts) do
    name =
      opts[:name] ||
        raise ArgumentError, "the :name option is required by #{inspect(__MODULE__)}"

    metrics =
      opts[:metrics] ||
        raise ArgumentError, "the :metrics option is required by #{inspect(__MODULE__)}"

    Agent.start_link(fn -> %{metrics: metrics} end, name: name)
  end

  def init(opts) do
    _name =
      opts[:name] ||
        raise ArgumentError, "the :name option is a required by #{inspect(__MODULE__)}.init/1"

    opts
  end

  def call(conn, opts) do
    conn
    |> put_layout({Phoenix.LiveDashboard.LayoutView, :dash})
    |> put_private(:phoenix_live_dashboard,
      router: Phoenix.Controller.router_module(conn),
      session: %{"name" => opts[:name]}
    )
    |> super(opts)
  end

  get("/", LiveDashboard.Plug, LiveDashboard.TelemetryLive)
end

defmodule Phoenix.LiveDashboard.Plug do
  @moduledoc false
  @behaviour Plug

  @impl Plug
  def init(view), do: view

  @impl Plug
  def call(conn, view) do
    %{phoenix_live_dashboard: init_opts} = conn.private
    opts = Phoenix.LiveView.Plug.init({view, init_opts})

    Phoenix.LiveView.Plug.call(conn, opts)
  end
end
