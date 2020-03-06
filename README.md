# Phoenix LiveDashboard

[Online Documentation](https://hexdocs.pm/phoenix_live_dashboard).

<!-- MDOC !-->

LiveDashboard provides real-time performance monitoring and debugging tools for Phoenix developers. It provides the following modules:

  * Metrics - See how your application performs under different conditions by visualizing [`:telemetry`](https://hexdocs.pm/telemetry) events with real-time charts

  * Request logging - See everything that was logged for certain requests

## Installation

To start using LiveDashboard, you will need three steps:

  1. Add the `phoenix_live_dashboard` dependency
  2. Configure LiveView
  3. Add the dashboard routes

### Add the `phoenix_live_dashboard` dependency

Add the following to your `mix.exs` and run `mix deps.get`:

```elixir
def deps do
  [
    {:phoenix_live_dashboard, github: "phoenixframework/phoenix_live_dashboard"}
  ]
end
```

### Configure LiveView

The LiveDashboard is built on top of LiveView. If LiveView is already installed in your app, feel free to skip this section.

If you plan to use LiveView in your application in the future, we recommend you to follow [the official installation instructions](https://hexdocs.pm/phoenix_live_view/installation.html).
This guide only covers the minimum steps necessary for the LiveDashboard itself to run.

First, update your endpoint's configuration to include a signing salt. You can generate a signing salt by running `mix phx.gen.secret 32` (note Phoenix v1.5+ apps already have this configuration):

    # config/config.exs
    config :my_app, MyAppWeb.Endpoint,
       live_view: [signing_salt: "SECRET_SALT"]

Then add the `Phoenix.LiveView.Socket` declaration to your endpodint:

    socket "/live", Phoenix.LiveView.Socket

And you are good to go!

### Add the dashboard routes

Once installed, update your router's configuration to forward requests to a LiveDashboard with a unique `name` of your choosing:

```elixir
# lib/my_app_web/router.ex
use MyAppWeb, :router

...

# If using LiveDashboard in production,
# remember to add authentication to it.
if Mix.env() == :dev do
  import Phoenix.LiveDashboard.Router

  scope "/" do
    pipe_through :browser
    live_dashboard "/dashboard", metrics: MyAppWeb.Telemetry
  end
end
```

Define [MyAppWeb.Telemetry](https://hexdocs.pm/phoenix_live_dashboard/metrics.html#define-your-telemetry-module) 

This is all. Run `mix phx.server` and access the "/dashboard" to configure the necessary modules.

<!-- MDOC !-->

## License

MIT License. Copyright (c) 2019 Michael Crumm, Chris McCord, José Valim.