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
          live_dashboard "/dashboard", MyAppWeb.Dashboard
        end
      end
  """
  defmacro live_dashboard(path, reporter) do
    quote bind_quoted: binding() do
      Phoenix.LiveView.Router.live(
        path,
        Phoenix.LiveDashboard.TelemetryLive,
        session: %{"name" => reporter},
        layout: {Phoenix.LiveDashboard.LayoutView, :dash}
      )
    end
  end
end
