defmodule Phoenix.LiveDashboard do
  @moduledoc """
  The Phoenix LiveView Dashboard.

  ## Usage

      # my_app_web/router.ex
      forward "/dashboard", Phoenix.LiveDashboard,
        name: MyApp.Dashboard,
        router: __MODULE__

      # my_app/application.ex
      children = [
        {Phoenix.LiveDashboard, name: MyApp.Dashboard, metrics: metrics()}
      ]

      defp metrics do
        [
          Telemetry.Metrics.counter("phoenix.endpoint.stop.duration"),
          Telemetry.Metrics.distribution("phoenix.endpoint.stop.duration", buckets: [100, 200, 300])
        ]
      end

      # assets/app.js

      # import LiveDashboard JS
      import LiveSocket from "phoenix_live_view"
      import LiveDashboard from "phoenix_live_dashboard"

      # load LiveDashboard.Hooks into your Hooks object
      const Hooks = {
        ...LiveDashboard.Hooks
      }

      # ...initialize LiveSocket as usual...
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

    router =
      opts[:router] ||
        raise ArgumentError, "the :router option is a required by #{inspect(__MODULE__)}.init/1"

    {router, opts}
  end

  def call(conn, {router, opts}) do
    conn
    |> put_private(:phoenix_live_dashboard,
      router: router,
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
