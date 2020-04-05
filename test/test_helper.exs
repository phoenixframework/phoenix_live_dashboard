Application.put_env(:phoenix_live_dashboard, Phoenix.LiveDashboardTest.Endpoint,
  url: [host: "localhost", port: 4000],
  secret_key_base: "Hu4qQN3iKzTV4fJxhorPQlA/osH9fAMtbtjVS58PFgfw3ja5Z18Q/WSNR9wP4OfW",
  live_view: [signing_salt: "hMegieSe"],
  render_errors: [view: Phoenix.LiveDashboardTest.ErrorView],
  check_origin: false,
  pubsub: [name: Phoenix.LiveDashboardTest.PubSub, adapter: Phoenix.PubSub.PG2]
)

defmodule Phoenix.LiveDashboardTest.ErrorView do
  use Phoenix.View, root: "test/templates"

  def template_not_found(template, _assigns) do
    Phoenix.Controller.status_message_from_template(template)
  end
end

defmodule Phoenix.LiveDashboardTest.Telemetry do
  import Telemetry.Metrics

  def metrics do
    [
      counter("phx.b.c"),
      counter("phx.b.d"),
      counter("ecto.f.g"),
      counter("my_app.h.i")
    ]
  end
end

defmodule Phoenix.LiveDashboardTest.Router do
  use Phoenix.Router
  import Phoenix.LiveDashboard.Router

  pipeline :browser do
    plug :fetch_session
  end

  scope "/", ThisWontBeUsed, as: :this_wont_be_used do
    pipe_through :browser
    live_dashboard("/dashboard", metrics: Phoenix.LiveDashboardTest.Telemetry)
  end
end

defmodule Phoenix.LiveDashboardTest.Endpoint do
  use Phoenix.Endpoint, otp_app: :phoenix_live_dashboard

  plug Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger_param_key",
    cookie_key: "request_logger_cookie_key"

  plug Plug.Session,
    store: :cookie,
    key: "_live_view_key",
    signing_salt: "/VEDsdfsffMnp5"

  plug Phoenix.LiveDashboardTest.Router
end

Phoenix.LiveDashboardTest.Endpoint.start_link()
ExUnit.start()
