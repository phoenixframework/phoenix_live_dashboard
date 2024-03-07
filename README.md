# Phoenix LiveDashboard

[![CI](https://github.com/phoenixframework/phoenix_live_dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/phoenixframework/phoenix_live_dashboard/actions/workflows/ci.yml)

[Online Documentation](https://hexdocs.pm/phoenix_live_dashboard).

<!-- MDOC !-->

LiveDashboard provides real-time performance monitoring and debugging tools for Phoenix developers. It provides the following modules:

- Home - See general information about the system

- OS Data - See general information about OS, such as CPU, Memory and Disk usage

- Metrics - See how your application performs under different conditions by visualizing [`:telemetry`](https://hexdocs.pm/telemetry) events with real-time charts

- Request logging - See everything that was logged for certain requests

- Applications - See, filter, and search applications in the current node and view their processes in a supervision tree

- Processes - See, filter, and search processes in the current node

- Ports - See, filter, and search ports (responsible for I/O) in the current node

- Sockets - See, filter, and search sockets (responsible for tcp/udp) in the current node

- ETS - See, filter, and search ETS tables (in-memory storage) in the current node

- Ecto Stats - Shows index, table, and general usage about the underlying Ecto Repo storage

The dashboard also works across nodes. If your nodes are connected via Distributed Erlang, then you can access information from node B while accessing the dashboard on node A.

![screenshot](https://github.com/phoenixframework/phoenix_live_dashboard/raw/main/screenshot.png)

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
    {:phoenix_live_dashboard, "~> 0.7"}
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
import Phoenix.LiveDashboard.Router

...

pipeline :admins_only do
  plug :admin_basic_auth
end

scope "/" do
  pipe_through [:browser, :admins_only]
  live_dashboard "/dashboard"
end

defp admin_basic_auth(conn, _opts) do
  username = System.fetch_env!("AUTH_USERNAME")
  password = System.fetch_env!("AUTH_PASSWORD")
  Plug.BasicAuth.basic_auth(conn, username: username, password: password)
end
```

If you are running your application behind a proxy or a webserver, you also have to make sure they are configured for allowing WebSocket upgrades. For example, [here is an article](https://web.archive.org/web/20171104012240/https://dennisreimann.de/articles/phoenix-nginx-config.html) on how to configure Nginx with Phoenix and WebSockets.

Finally, you will also want to configure your `config/prod.exs` and use your domain name under the `check_origin` configuration:

    check_origin: ["//myapp.com"]

Then you should be good to go!

## Using from the command line with PLDS

It's possible to use the LiveDashboard without having to add it as a dependency of your
application, or when you don't have Phoenix installed. [`PLDS`](https://hexdocs.pm/plds) is a command
line tool that provides a standalone version of LiveDashboard with some batteries included.

You can install it with:

    $ mix escript.install hex plds

And connect to a running node with:

    $ plds server --connect mynode --open

For more details, please check the [PLDS documentation](https://hexdocs.pm/plds).

<!-- MDOC !-->

## Contributing

For those planning to contribute to this project, you can run a dev version of the dashboard with the following commands:

    $ mix setup
    $ mix dev

Additionally, you may pass some options to enable Ecto testing. For example, to enable the PostgreSQL repo:

    $ mix dev --postgres

...and to enable the MySQL repo:

    $ mix dev --mysql

...and to enable the SQLite repo:

    $ mix dev --sqlite

Alternatively, run `iex -S mix dev [flags]` if you also want a shell.

Before submitting a pull request, discard any changes that were made to the `dist` directory.

For example, to rollback using git restore:

    $ git restore dist

## License

MIT License. Copyright (c) 2019 Michael Crumm, Chris McCord, José Valim.
