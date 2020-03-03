defmodule Phoenix.LiveDashboard.Router do
  @moduledoc """
  Provides LiveView routing for LiveDashboard.
  """

  @doc """
  Defines a LiveDashboard route.

  ## Examples

      defmodule MyAppWeb.Router
        use Phoenix.Router
        import Phoenix.LiveView.Router
        import Phoenix.LiveDashboard.Router

        scope "/", MyAppWeb do
          pipe_through [:browser]
          live "/thermostat", ThermostatLive
          live_dashboard "/dashboard", metrics: {MyAppWeb.Telemetry, :metrics}
        end
      end

  """
  defmacro live_dashboard(path, options \\ []) do
    quote bind_quoted: binding() do
      scope path do
        import Phoenix.LiveView.Router, only: [live: 4]

        opts = Phoenix.LiveDashboard.Router.__options__(options)
        live("/", Phoenix.LiveDashboard.IndexLive, :index, opts)
        live("/metrics", Phoenix.LiveDashboard.MetricsLive, :metrics, opts)
      end
    end
  end

  @doc false
  def __options__(options) do
    metrics =
      case options[:metrics] do
        mod when is_atom(mod) ->
          {mod, :metrics}

        {mod, fun} when is_atom(mod) and is_atom(fun) ->
          {mod, fun}

        nil ->
          nil

        other ->
          raise ":metrics must be a tuple with {Mod, fun}, " <>
                  "such as {MyAppWeb.Telemetry, :metrics}, got: #{inspect(other)}"
      end

    [
      session: %{"metrics" => metrics},
      layout: {Phoenix.LiveDashboard.LayoutView, :dash},
      as: :live_dashboard
    ]
  end
end
