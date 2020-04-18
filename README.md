# Phoenix LiveDashboard

[Online Documentation](https://hexdocs.pm/phoenix_live_dashboard).

<!-- MDOC !-->

LiveDashboard provides real-time performance monitoring and debugging tools for Phoenix developers. It provides the following modules:

  * Home - See general information about the system

  * Metrics - See how your application performs under different conditions by visualizing [`:telemetry`](https://hexdocs.pm/telemetry) events with real-time charts

  * Request logging - See everything that was logged for certain requests

  * Processes - See, filter, and search processes in your application

The dashboard also works across nodes. If your nodes are connected via Distributed Erlang, then you can access information from node B while accessing the dashboard on node A.

![screenshot](https://github.com/phoenixframework/phoenix_live_dashboard/raw/master/screenshot.png)

## Installation

To start using LiveDashboard, you will need three steps:

  1. Add the `phoenix_live_dashboard` dependency
  2. Configure LiveView
  3. Add dashboard access

### 1. Add the `phoenix_live_dashboard` dependency

Add the following to your `mix.exs` and run `mix deps.get`:

```elixir
def deps do
  [
    {:phoenix_live_dashboard, "~> 0.1"}
  ]
end
```

### 2. Configure LiveView

The LiveDashboard is built on top of LiveView. If LiveView is already installed in your app, feel free to skip this section.

If you plan to use LiveView in your application in the future, we recommend you to follow [the official installation instructions](https://hexdocs.pm/phoenix_live_view/installation.html).
This guide only covers the minimum steps necessary for the LiveDashboard itself to run.

First, update your endpoint's configuration to include a signing salt. You can generate a signing salt by running `mix phx.gen.secret 32` (note Phoenix v1.5+ apps already have this configuration):

```elixir
# config/config.exs
config :my_app, MyAppWeb.Endpoint,
  live_view: [signing_salt: "SECRET_SALT"]
```
Then add the `Phoenix.LiveView.Socket` declaration to your endpoint:

```elixir
socket "/live", Phoenix.LiveView.Socket
```

And you are good to go!

### 3. Add dashboard access for development-only usage

Once installed, update your router's configuration to forward requests to a LiveDashboard with a unique `name` of your choosing:

```elixir
# lib/my_app_web/router.ex
use MyAppWeb, :router
import Phoenix.LiveDashboard.Router

...

if Mix.env() == :dev do
  scope "/" do
    pipe_through :browser
    live_dashboard "/dashboard"
  end
end
```

This is all. Run `mix phx.server` and access the "/dashboard" to configure the necessary modules.

### Extra: Add dashboard access on all environments (including production)

If you want to use the LiveDashboard in production, you should put it behind some authentication and allow only admins to access it. If your application does not have an admins-only section yet, you can use `Plug.BasicAuth` to set up some basic authentication as long as you are also using SSL (which you should anyway):

```elixir
# lib/my_app_web/router.ex
use MyAppWeb, :router
import Plug.BasicAuth
import Phoenix.LiveDashboard.Router

...

pipeline :admins_only do
  plug :basic_auth, username: "admin", password: "a very special secret"
end

scope "/" do
  pipe_through [:browser, :admins_only]
  live_dashboard "/dashboard"
end
```

<!-- MDOC !-->

## Contributing

For those planning to contribute to this project, you can run a dev version of the dashboard with the following commands:

    $ mix deps.get
    $ npm install --prefix assets
    $ mix run --no-halt dev.exs

Alternatively, run `iex -S mix run dev.exs` if you also want a shell.

## License

MIT License. Copyright (c) 2019 Michael Crumm, Chris McCord, José Valim.
