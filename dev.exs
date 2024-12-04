#######################################
# Development Server for LiveDashboard
#
# Options:
#
#   * --postgres - starts the Demo.Postgres repo
#
#   * --mysql - starts the Demo.MyXQL repo
#
#   * --sqlite - starts the Demo.SQLite repo
#
# Usage:
#
# $ iex -S mix dev [flags]
#######################################
Mix.ensure_application!(:os_mon)
Logger.configure(level: :debug)

argv = System.argv()

{opts, _, _} =
  OptionParser.parse(argv, strict: [mysql: :boolean, postgres: :boolean, sqlite: :boolean])

%{mysql: mysql?, postgres: postgres?, sqlite: sqlite?} =
  Map.merge(%{mysql: false, postgres: false, sqlite: false}, Map.new(opts))

if postgres? do
  pg_url = System.get_env("PG_URL") || "postgres:postgres@127.0.0.1"
  pg_db = System.get_env("PG_DATABASE") || "phx_dashboard_dev"
  Application.put_env(:phoenix_live_dashboard, Demo.Postgres, url: "ecto://#{pg_url}/#{pg_db}")

  defmodule Demo.Postgres do
    use Ecto.Repo, otp_app: :phoenix_live_dashboard, adapter: Ecto.Adapters.Postgres
  end

  _ = Ecto.Adapters.Postgres.storage_up(Demo.Postgres.config())
end

if mysql? do
  mysql_url = System.get_env("MYSQL_URL") || "root@127.0.0.1"
  mysql_db = System.get_env("MYSQL_DATABASE") || "phx_dashboard_dev"
  Application.put_env(:phoenix_live_dashboard, Demo.MyXQL, url: "ecto://#{mysql_url}/#{mysql_db}")

  defmodule Demo.MyXQL do
    use Ecto.Repo, otp_app: :phoenix_live_dashboard, adapter: Ecto.Adapters.MyXQL
  end

  _ = Ecto.Adapters.MyXQL.storage_up(Demo.MyXQL.config())
end

if sqlite? do
  sqlite_db = System.get_env("SQLITE_DB") || "dev.db"
  Application.put_env(:phoenix_live_dashboard, Demo.SQLite, database: sqlite_db)

  defmodule Demo.SQLite do
    use Ecto.Repo, otp_app: :phoenix_live_dashboard, adapter: Ecto.Adapters.SQLite3
  end

  _ = Ecto.Adapters.SQLite3.storage_up(Demo.SQLite.config())
end

# Configures the endpoint
Application.put_env(:phoenix_live_dashboard, DemoWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Hu4qQN3iKzTV4fJxhorPQlA/osH9fAMtbtjVS58PFgfw3ja5Z18Q/WSNR9wP4OfW",
  live_view: [signing_salt: "hMegieSe"],
  http: [port: System.get_env("PORT") || 4000],
  debug_errors: true,
  check_origin: false,
  pubsub_server: Demo.PubSub,
  watchers: [
    esbuild: {Esbuild, :install_and_run, [:default, ~w(--watch)]},
    sass: {DartSass, :install_and_run, [:default, ~w(--watch)]}
  ],
  live_reload: [
    patterns: [
      ~r"dist/.*(js|css|png|jpeg|jpg|gif|svg)$",
      ~r"lib/phoenix/live_dashboard/(live|views)/.*(ex)$",
      ~r"lib/phoenix/live_dashboard/templates/.*(ex)$"
    ]
  ]
)

defmodule DemoWeb.History do
  use GenServer

  @history_buffer_size 50

  def data(metric) do
    GenServer.call(__MODULE__, {:data, metric})
  end

  def start_link(args) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  @impl true
  def init(metrics) do
    Process.flag(:trap_exit, true)

    metric_histories_map =
      metrics
      |> Enum.map(fn metric ->
        attach_handler(metric)
        {metric, CircularBuffer.new(@history_buffer_size)}
      end)
      |> Map.new()

    {:ok, metric_histories_map}
  end

  @impl true
  def terminate(_, metrics) do
    for {metric, _} <- metrics do
      :telemetry.detach({__MODULE__, metric, self()})
    end

    :ok
  end

  defp attach_handler(%{name: name_list} = metric) do
    :telemetry.attach(
      {__MODULE__, metric, self()},
      Enum.slice(name_list, 0, length(name_list) - 1),
      &__MODULE__.handle_event/4,
      metric
    )
  end

  def handle_event(_event_name, data, metadata, metric) do
    if data = Phoenix.LiveDashboard.extract_datapoint_for_metric(metric, data, metadata) do
      GenServer.cast(__MODULE__, {:telemetry_metric, data, metric})
    end
  end

  @impl true
  def handle_cast({:telemetry_metric, data, metric}, state) do
    {:noreply, update_in(state[metric], &CircularBuffer.insert(&1, data))}
  end

  @impl true
  def handle_call({:data, metric}, _from, state) do
    if history = state[metric] do
      {:reply, CircularBuffer.to_list(history), state}
    else
      {:reply, [], state}
    end
  end
end

defmodule DemoWeb.Telemetry do
  import Telemetry.Metrics

  def metrics do
    [
      # Phoenix Metrics
      last_value("phoenix.endpoint.stop.duration",
        description: "Last value of phoenix.endpoint response time",
        unit: {:native, :millisecond}
      ),
      distribution("phoenix.endpoint.stop.duration",
        description: "Distribution of phoenix.endpoint response time",
        unit: {:native, :millisecond},
        reporter_options: [bucket_size: 2]
      ),
      counter("phoenix.endpoint.stop.duration",
        unit: {:native, :millisecond}
      ),
      summary("phoenix.endpoint.stop.duration",
        unit: {:native, :microsecond}
      ),
      last_value("phoenix.router_dispatch.stop.duration",
        tags: [:route],
        unit: {:native, :millisecond}
      ),
      counter("phoenix.router_dispatch.stop.duration",
        tags: [:route],
        unit: {:native, :millisecond}
      ),
      summary("phoenix.router_dispatch.stop.duration",
        tags: [:route],
        unit: {:native, :millisecond}
      ),

      # VM Metrics
      summary("vm.memory.total", unit: {:byte, :kilobyte}),
      summary("vm.total_run_queue_lengths.total"),
      summary("vm.total_run_queue_lengths.cpu"),
      summary("vm.total_run_queue_lengths.io")
    ]
  end
end

defmodule DemoWeb.PageController do
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, :index) do
    content(conn, """
    <h2>Phoenix LiveDashboard Dev</h2>
    <a href="/dashboard">Open Dashboard</a>
    """)
  end

  def call(conn, :hello) do
    name = Map.get(conn.params, "name", "friend")
    content(conn, "<p>Hello, #{name}!</p>")
  end

  def call(conn, :get) do
    json(conn, %{
      args: conn.params,
      headers: Map.new(conn.req_headers),
      url: Phoenix.Controller.current_url(conn)
    })
  end

  defp content(conn, content) do
    conn
    |> put_resp_header("content-type", "text/html")
    |> send_resp(200, "<!doctype html><html><body>#{content}</body></html>")
  end

  defp json(conn, data) do
    body = Phoenix.json_library().encode_to_iodata!(data, pretty: true)

    conn
    |> Plug.Conn.put_resp_header("content-type", "application/json; charset=utf-8")
    |> Plug.Conn.send_resp(200, body)
  end
end

defmodule DemoWeb.GraphShowcasePage do
  use Phoenix.LiveDashboard.PageBuilder, refresher?: false

  @impl true
  def menu_link(_, _) do
    {:ok, "Graph component"}
  end

  @impl true
  def mount(_params, _, socket) do
    {:ok, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_nav_bar id="navbar" page={@page}>
      <:item name="Simple">
        <.simple />
      </:item>
      <:item name="Double">
        <.two_groups />
      </:item>
      <:item name="Groups with intercalation">
        <.two_groups_intercalation />
      </:item>
      <:item name="Broadway graph">
        <.broadway_graph />
      </:item>
      <:item name="Wider graph">
        <.wider_graph />
      </:item>
    </.live_nav_bar>
    """
  end

  defp simple(assigns) do
    assigns =
      assigns
      |> assign(:title, "Simple graph")
      |> assign(:id, "simple")
      |> assign(:layers, [
        [%{id: "a1", data: "a1", children: ["b1", "b2"]}],
        [%{id: "b1", data: "b1", children: ["c1"]}, %{id: "b2", data: "b2", children: ["c1"]}],
        [%{id: "c1", data: "c1", children: []}]
      ])

    ~H"""
    <.live_layered_graph {assigns} />
    """
  end

  defp two_groups(assigns) do
    assigns =
      assigns
      |> assign(:background, fn data ->
        if String.starts_with?(data, "a"), do: "#5d89c7", else: "#555"
      end)
      |> assign(:layers, [
        [
          %{id: "a1", data: "a1", children: ["b1", "b2"]},
          %{id: "a2", data: "a2", children: ["b3", "b4"]},
          %{id: "a3", data: "a3", children: ["b3", "b4"]},
          %{id: "a4", data: "a4", children: ["b3", "b4"]},
          %{id: "a5", data: "a5", children: ["b3", "b4"]}
        ],
        [
          %{id: "b1", data: "b1", children: []},
          %{id: "b2", data: "b2", children: []},
          %{id: "b3", data: "b3", children: []},
          %{id: "b4", data: "b4", children: []}
        ]
      ])
      |> assign(:title, "Two groups")
      |> assign(:hint, "This chart shows that we can have groups based on parent nodes.")
      |> assign(:id, "two_groups")

    ~H"""
    <.live_layered_graph {assigns} />
    """
  end

  defp two_groups_intercalation(assigns) do
    assigns =
      assigns
      |> assign(:format_label, &String.upcase/1)
      |> assign(:title, "Two groups with intercalation")
      |> assign(:hint, "This chart shows that intercalation of children is correctly displayed.")
      |> assign(:id, "two_groups_intercalation")
      |> assign(:layers, [
        [
          %{id: "a1", data: "a1", children: ["b1", "b3", "b5"]},
          %{id: "a2", data: "a2", children: ["b2", "b4", "b6"]}
        ],
        [
          %{id: "b1", data: "b1", children: []},
          %{id: "b2", data: "b2", children: []},
          %{id: "b3", data: "b3", children: []},
          %{id: "b4", data: "b4", children: []},
          %{id: "b5", data: "b5", children: []},
          %{id: "b6", data: "b6", children: []}
        ]
      ])

    ~H"""
    <.live_layered_graph {assigns} />
    """
  end

  defp broadway_graph(assigns) do
    background = fn data ->
      case data do
        %{detail: perc} ->
          hue = 100 - perc

          "hsl(#{hue}, 80%, 35%)"

        _ ->
          "lightgray"
      end
    end

    assigns =
      assigns
      |> assign(:background, background)
      |> assign(:format_detail, fn data -> "#{data.detail}%" end)
      |> assign(:title, "Broadway graph")
      |> assign(:id, "broadway_graph")
      |> assign(:layers, [
        [
          %{
            children: [
              Demo.Pipeline.Broadway.Processor_default_0,
              Demo.Pipeline.Broadway.Processor_default_1,
              Demo.Pipeline.Broadway.Processor_default_2,
              Demo.Pipeline.Broadway.Processor_default_3,
              Demo.Pipeline.Broadway.Processor_default_4
            ],
            data: "prod_0",
            id: Demo.Pipeline.Broadway.Producer_0
          }
        ],
        [
          %{
            children: [Demo.Pipeline.Broadway.Batcher_default],
            data: %{detail: 84, label: "proc_0"},
            id: Demo.Pipeline.Broadway.Processor_default_0
          },
          %{
            children: [Demo.Pipeline.Broadway.Batcher_default],
            data: %{detail: 13, label: "proc_1"},
            id: Demo.Pipeline.Broadway.Processor_default_1
          },
          %{
            children: [Demo.Pipeline.Broadway.Batcher_default],
            data: %{detail: 80, label: "proc_2"},
            id: Demo.Pipeline.Broadway.Processor_default_2
          },
          %{
            children: [Demo.Pipeline.Broadway.Batcher_default],
            data: %{detail: 82, label: "proc_3"},
            id: Demo.Pipeline.Broadway.Processor_default_3
          },
          %{
            children: [Demo.Pipeline.Broadway.Batcher_default],
            data: %{detail: 40, label: "proc_4"},
            id: Demo.Pipeline.Broadway.Processor_default_4
          }
        ],
        [
          %{
            children: [
              Demo.Pipeline.Broadway.BatchProcessor_default_0,
              Demo.Pipeline.Broadway.BatchProcessor_default_1,
              Demo.Pipeline.Broadway.BatchProcessor_default_2
            ],
            data: %{detail: 33, label: "default"},
            id: Demo.Pipeline.Broadway.Batcher_default
          }
        ],
        [
          %{
            children: [],
            data: %{detail: 61, label: "proc_0"},
            id: Demo.Pipeline.Broadway.BatchProcessor_default_0
          },
          %{
            children: [],
            data: %{detail: 61, label: "proc_1"},
            id: Demo.Pipeline.Broadway.BatchProcessor_default_1
          },
          %{
            children: [],
            data: %{detail: 53, label: "proc_2"},
            id: Demo.Pipeline.Broadway.BatchProcessor_default_2
          }
        ]
      ])

    ~H"""
    <.live_layered_graph {assigns} />
    """
  end

  defp wider_graph(assigns) do
    bottom_layer = for i <- 1..20, do: %{id: "b#{i}", data: "b#{i}", children: []}

    assigns =
      assigns
      |> assign(:title, "Simple graph")
      |> assign(:id, "wider_graph")
      |> assign(:layers, [
        [%{id: "a1", data: "a1", children: Enum.map(1..20, &"b#{&1}")}],
        bottom_layer
      ])

    ~H"""
    <.live_layered_graph {assigns} />
    """
  end
end

defmodule DemoWeb.Router do
  use Phoenix.Router
  import Phoenix.LiveDashboard.Router

  pipeline :browser do
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_csp
  end

  scope "/" do
    pipe_through :browser
    get "/", DemoWeb.PageController, :index
    get "/get", DemoWeb.PageController, :get
    get "/hello", DemoWeb.PageController, :hello
    get "/hello/:name", DemoWeb.PageController, :hello

    live_dashboard("/dashboard",
      env_keys: ["USER", "ROOTDIR"],
      metrics: DemoWeb.Telemetry,
      metrics_history: {DemoWeb.History, :data, []},
      allow_destructive_actions: true,
      home_app: {"Erlang's stdlib", :stdlib},
      additional_pages: [
        components: DemoWeb.GraphShowcasePage
      ],
      csp_nonce_assign_key: %{
        style: :style_csp_nonce,
        script: :script_csp_nonce
      },
      ecto_psql_extras_options: [
        long_running_queries: [threshold: "200 milliseconds"]
      ],
      ecto_mysql_extras_options: [
        long_running_queries: [threshold: 200]
      ]
    )
  end

  defp nonce do
    16 |> :crypto.strong_rand_bytes() |> Base.url_encode64(padding: false)
  end

  def put_csp(conn, _opts) do
    style_nonce = nonce()
    script_nonce = noonce()

    conn
    |> assign(:style_csp_nonce, style_nonce)
    |> assign(:script_csp_nonce, script_nonce)
    |> put_resp_header(
      "content-security-policy",
      "default-src; script-src 'nonce-#{script_nonce}'; style-src-elem 'nonce-#{style_nonce}'; " <>
        "img-src data: ; font-src data: ; connect-src 'self'; frame-src 'self' ;"
    )
  end
end

defmodule DemoWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :phoenix_live_dashboard

  @session_options [
    store: :cookie,
    key: "_live_view_key",
    signing_salt: "/VEDsdfsffMnp5",
    same_site: "Lax"
  ]

  socket "/live", Phoenix.LiveView.Socket, websocket: [connect_info: [session: @session_options]]
  socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket

  plug Phoenix.LiveReloader
  plug Phoenix.CodeReloader

  plug Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"

  plug Plug.Session, @session_options

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]
  plug DemoWeb.Router
end

Application.ensure_all_started(:os_mon)
Application.put_env(:phoenix, :serve_endpoints, true)

Task.async(fn ->
  children = []
  children = if postgres?, do: [Demo.Postgres | children], else: children
  children = if mysql?, do: [Demo.MyXQL | children], else: children
  children = if sqlite?, do: [Demo.SQLite | children], else: children

  children =
    children ++
      [
        {Phoenix.PubSub, [name: Demo.PubSub, adapter: Phoenix.PubSub.PG2]},
        {DemoWeb.History, DemoWeb.Telemetry.metrics()},
        DemoWeb.Endpoint
      ]

  {:ok, _} = Supervisor.start_link(children, strategy: :one_for_one)
  Process.sleep(:infinity)
end)
|> Task.await(:infinity)
