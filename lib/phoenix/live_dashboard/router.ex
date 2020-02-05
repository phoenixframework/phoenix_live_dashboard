defmodule Phoenix.LiveDashboard.Router do
  @moduledoc """
  Provides LiveView routing for LiveDashboard.
  """

  @doc """
  Defines a LiveDashboard route.

  Accepts the same options as [`live/3`](`Phoenix.LiveView.Router.live/3`).

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
  defmacro live_dashboard(path, reporter, opts \\ []) do
    quote bind_quoted: binding() do
      Phoenix.LiveView.Router.live(
        path,
        Phoenix.LiveDashboard.TelemetryLive,
        Phoenix.LiveDashboard.Router.__opts__(reporter, opts)
      )
    end
  end

  @doc false
  def __opts__(reporter, opts) do
    opts
    |> Keyword.put(:session, %{"name" => reporter})
    |> Keyword.put(:layout, {Phoenix.LiveDashboard.LayoutView, :dash})
  end
end
