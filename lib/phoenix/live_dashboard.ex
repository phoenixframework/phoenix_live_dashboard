defmodule Phoenix.LiveDashboard do
  @moduledoc """
  The  Phoenix LiveView Dashboard.

  ## Usage
      # my_app_web/router.ex
      forward "/dashboard", Phoenix.LiveDashboard

      # my_app/application.ex
      children = [
        {Phoenix.LiveDashboard, metrics: metrics()}
      ]

      defp metrics do
        [
          Telemetry.Metrics.counter("phoenix.endpoint.stop.duration"),
          Telemetry.Metrics.distribution("phoenix.endpoint.stop.duration", buckets: [100, 200, 300])
        ]
      end
  """
  use Phoenix.Router
  use Agent

  alias Phoenix.LiveDashboard

  def start_link(opts) do
    metrics =
      opts[:metrics] ||
        raise ArgumentError, "the :metrics option is required by #{inspect(__MODULE__)}"

    Agent.start_link(fn -> %{metrics: metrics} end, name: __MODULE__)
  end

  def init(opts) do
    router =
      opts[:router] ||
        raise "the :router option is a required by #{inspect(__MODULE__)}.init/1"

    {router, opts}
  end

  def call(conn, {router, opts}) do
    conn
    |> put_private(:phoenix_live_dashboard_router, router)
    |> super(opts)
  end

  get "/", LiveDashboard.Plug, LiveDashboard.MetricsLive
  get "/baz", LiveDashboard.Plug, LiveDashboard.MetricsLive
end

defmodule Phoenix.LiveDashboard.Plug do
  @behaviour Plug

  @impl Plug
  def init(view), do: view

  @impl Plug
  def call(conn, view) do
    opts = Phoenix.LiveView.Plug.init({view, router: conn.private.phoenix_live_dashboard_router})
    Phoenix.LiveView.Plug.call(conn, opts)
  end
end
