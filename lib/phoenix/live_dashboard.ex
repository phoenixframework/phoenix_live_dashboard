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

  ## Installation

  See [the installation guide](installation.html) to
  get started.

  ## Metrics

  This module is responsible for tracking the metrics you
  want to show in your LiveDashboard. You start by adding
  this module to your Telemetry supervision tree (usually in
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

  Then, to access the dashboard, you use the
  [`live_dashboard/2`](`Phoenix.LiveDashboard.Router.live_dashboard/2`)
  macro in your `Phoenix.Router` (usually in `lib/my_app_web/router.ex`):

      # LiveDashboard is only recommended in dev, for now :)
      if Mix.env() == :dev do
        import Phoenix.LiveDashboard.Router

        scope "/" do
          pipe_through :browser
          live_dashboard "/dashboard", MyAppWeb.Dashboard
        end
      end

  ### Telemetry

  LiveDashboard integrates with `Telemetry.Metrics` to
  render your application metrics as beatiful, real-time
  charts.

  The following table shows how `Telemetry.Metrics` metrics
  map to LiveDashboard charts:

  | Telemetry.Metrics | Chart |
  |-------------------|-------|
  | `last_value`      | `Doughnut`, always set to an absolute value |
  | `counter`         | `Doughnut`, always increased by 1 |
  | `summary`         | `Line`, recording individual measurement using time scale |
  | `distribution`    | (Coming Soon) `Line`, recording measurement in individual buckets using time scale |
  """

  use Agent

  @doc false
  def start_link(opts) do
    name =
      opts[:name] ||
        raise ArgumentError, "the :name option is required by #{inspect(__MODULE__)}"

    metrics =
      opts[:metrics] ||
        raise ArgumentError, "the :metrics option is required by #{inspect(__MODULE__)}"

    Agent.start_link(fn -> %{metrics: metrics} end, name: name)
  end
end
