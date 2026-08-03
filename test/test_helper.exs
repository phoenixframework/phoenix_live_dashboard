System.put_env("PHX_DASHBOARD_TEST", "PHX_DASHBOARD_ENV_VALUE")

pg_url = System.get_env("PG_URL") || "postgres:postgres@127.0.0.1"
mysql_url = System.get_env("MYSQL_URL") || "root@127.0.0.1"
sqlite_db = System.get_env("SQLITE_DB") || "test.db"

Application.put_env(:phoenix_live_dashboard, Phoenix.LiveDashboardTest.Repo,
  url: "ecto://#{pg_url}/phx_dashboard_test"
)

defmodule Phoenix.LiveDashboardTest.Repo do
  use Ecto.Repo, otp_app: :phoenix_live_dashboard, adapter: Ecto.Adapters.Postgres
end

_ = Ecto.Adapters.Postgres.storage_up(Phoenix.LiveDashboardTest.Repo.config())

Application.put_env(:phoenix_live_dashboard, Phoenix.LiveDashboardTest.PGRepo,
  url: "ecto://#{pg_url}/phx_dashboard_test"
)

defmodule Phoenix.LiveDashboardTest.PGRepo do
  use Ecto.Repo, otp_app: :phoenix_live_dashboard, adapter: Ecto.Adapters.Postgres
end

_ = Ecto.Adapters.Postgres.storage_up(Phoenix.LiveDashboardTest.PGRepo.config())

Application.put_env(:phoenix_live_dashboard, Phoenix.LiveDashboardTest.MySQLRepo,
  url: "ecto://#{mysql_url}/phx_dashboard_test"
)

defmodule Phoenix.LiveDashboardTest.MySQLRepo do
  use Ecto.Repo, otp_app: :phoenix_live_dashboard, adapter: Ecto.Adapters.MyXQL
end

_ = Ecto.Adapters.MyXQL.storage_up(Phoenix.LiveDashboardTest.MySQLRepo.config())

Application.put_env(:phoenix_live_dashboard, Phoenix.LiveDashboardTest.SQLiteRepo,
  database: sqlite_db
)

defmodule Phoenix.LiveDashboardTest.SQLiteRepo do
  use Ecto.Repo, otp_app: :phoenix_live_dashboard, adapter: Ecto.Adapters.SQLite3
end

_ = Ecto.Adapters.SQLite3.storage_up(Phoenix.LiveDashboardTest.SQLiteRepo.config())

Application.put_env(:phoenix_live_dashboard, Phoenix.LiveDashboardTest.CustomRepo,
  url: "ecto://#{pg_url}/phx_dashboard_test"
)

defmodule Phoenix.LiveDashboardTest.CustomRepo do
  use Ecto.Repo, otp_app: :phoenix_live_dashboard, adapter: Ecto.Adapters.Postgres
end

_ = Ecto.Adapters.Postgres.storage_up(Phoenix.LiveDashboardTest.CustomRepo.config())

Application.put_env(:phoenix_live_dashboard, Phoenix.LiveDashboardTest.Endpoint,
  url: [host: "localhost", port: 4000],
  secret_key_base: "Hu4qQN3iKzTV4fJxhorPQlA/osH9fAMtbtjVS58PFgfw3ja5Z18Q/WSNR9wP4OfW",
  live_view: [signing_salt: "hMegieSe"],
  render_errors: [view: Phoenix.LiveDashboardTest.ErrorView],
  check_origin: false,
  pubsub_server: Phoenix.LiveDashboardTest.PubSub
)

defmodule Phoenix.LiveDashboardTest.ErrorView do
  def render(template, _assigns) do
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

defmodule Phoenix.LiveDashboardTest.FakeOldEctoExtras do
  defmodule Query do
    def info do
      %{
        title: "Fake old query",
        columns: [%{name: :value, type: :integer}],
        default_args: [threshold: 10]
      }
    end

    def query(_args \\ []), do: "SELECT 1"
  end

  def queries(_repo \\ nil), do: %{fake_old: Query}
  def query(_name, _repo, _opts), do: %{columns: ["value"], rows: [[1]]}
end

defmodule Phoenix.LiveDashboardTest.FakeNewEctoExtras do
  defmodule Query do
    def info do
      %{
        title: "Fake new query",
        columns: [%{name: :threshold, type: :integer}, %{name: :enabled, type: :boolean}],
        parameters: [
          %{
            name: :threshold,
            type: :integer,
            default: 10,
            description: "minimum number of calls"
          },
          %{
            name: :enabled,
            type: :boolean,
            default: true,
            description: "whether the check is enabled"
          }
        ]
      }
    end

    def query(args \\ []), do: {"SELECT $1, $2", [args[:threshold], args[:enabled]]}
  end

  def queries(_repo \\ nil), do: %{fake_new: Query}

  def query(_name, _repo, opts) do
    %{
      columns: ["threshold", "enabled"],
      rows: [[opts[:args][:threshold], opts[:args][:enabled]]]
    }
  end
end

defmodule Phoenix.LiveDashboardTest.FakeRaisingEctoExtras do
  defmodule Query do
    def info do
      %{
        title: "Fake raising query",
        columns: [%{name: :value, type: :string}],
        parameters: [%{name: :input, type: :string}]
      }
    end

    def query(_args \\ []), do: {"SELECT 1", []}
  end

  def queries(_repo \\ nil), do: %{fake_raising: Query}
  def query(_name, _repo, _opts), do: raise("boom: the query could not run")
end

defmodule Phoenix.LiveDashboardTest.Router do
  use Phoenix.Router
  import Phoenix.LiveDashboard.Router

  pipeline :browser do
    plug :fetch_session
  end

  scope "/", ThisWontBeUsed, as: :this_wont_be_used do
    pipe_through :browser

    # Ecto repos will be auto discoverable.
    live_dashboard "/dashboard",
      metrics: Phoenix.LiveDashboardTest.Telemetry

    live_dashboard "/parent_cookie_domain",
      request_logger_cookie_domain: :parent,
      live_session_name: :cookie_dashboard

    live_dashboard "/custom_ecto",
      ecto_repos: [
        {Phoenix.LiveDashboardTest.Repo, Phoenix.LiveDashboardTest.FakeOldEctoExtras},
        {Phoenix.LiveDashboardTest.PGRepo, Phoenix.LiveDashboardTest.FakeNewEctoExtras},
        {Phoenix.LiveDashboardTest.SQLiteRepo, Phoenix.LiveDashboardTest.FakeRaisingEctoExtras}
      ],
      live_session_name: :custom_ecto_dashboard
  end

  # we only really support one live dashboard per router,
  # and some tests rely on correct redirect paths that wouldn't work with multiple dashboards;
  # as a workaround we forward all non matching requests to a separate router
  forward "/", Phoenix.LiveDashboardTest.RouterConfig
end

defmodule Phoenix.LiveDashboardTest.RouterConfig do
  use Phoenix.Router
  import Phoenix.LiveDashboard.Router

  pipeline :browser do
    plug :fetch_session
  end

  scope "/", ThisWontBeUsed, as: :this_wont_be_used do
    pipe_through :browser

    live_dashboard "/config",
      live_socket_path: "/custom/live",
      csp_nonce_assign_key: %{
        style: :style_csp_nonce,
        script: :script_csp_nonce
      },
      env_keys: ["PHX_DASHBOARD_TEST"],
      home_app: {"Erlang's stdlib", :stdlib},
      allow_destructive_actions: true,
      metrics: Phoenix.LiveDashboardTest.Telemetry,
      metrics_history: {TestHistory, :test_data, []},
      request_logger_cookie_domain: "my.domain",
      live_session_name: :config_dashboard
  end
end

defmodule TestHistory do
  def label1, do: "Z"
  def measurement1, do: 26
  def label2, do: "X"
  def measurement2, do: 27

  def test_data(_metric) do
    [
      %{label: label1(), measurement: measurement1(), time: System.system_time(:microsecond)},
      %{label: label2(), measurement: measurement2(), time: System.system_time(:microsecond)}
    ]
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

Application.stop(:ssh)
Application.unload(:ssh)
Application.ensure_all_started(:os_mon)

Supervisor.start_link(
  [
    {Phoenix.PubSub, name: Phoenix.LiveDashboardTest.PubSub, adapter: Phoenix.PubSub.PG2},
    Phoenix.LiveDashboardTest.Endpoint
  ],
  strategy: :one_for_one
)

ExUnit.start(exclude: :integration)
