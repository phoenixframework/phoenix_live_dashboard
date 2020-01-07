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
  use Agent
  alias Phoenix.LiveDashboard.MetricsLive

  @behaviour Plug

  def start_link(opts) do
    metrics =
      opts[:metrics] ||
        raise ArgumentError, "the :metrics option is required by #{inspect(__MODULE__)}"

    Agent.start_link(fn -> %{metrics: metrics} end, name: __MODULE__)
  end

  @impl Plug
  def init(opts \\ []) do
    {router, opts} = Keyword.pop(opts, :router)

    unless router do
      raise "the :router option is a required by #{inspect(__MODULE__)}.init/1"
    end

    {router, opts}
  end

  @impl Plug
  def call(conn, {router, opts}) do
    conn
    |> put_live_view(router, opts)
    |> Phoenix.LiveView.Plug.call(MetricsLive)
  end

  defp put_live_view(conn, router, opts) do
    Plug.Conn.put_private(
      conn,
      :phoenix_live_view,
      Phoenix.LiveView.Router.__live_options__(router, opts)
    )
  end
end
