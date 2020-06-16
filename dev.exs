# iex -S mix run dev.exs
Logger.configure(level: :debug)

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
    node: [
      "node_modules/webpack/bin/webpack.js",
      "--mode",
      "production",
      "--watch-stdin",
      cd: "assets"
    ]
  ],
  live_reload: [
    patterns: [
      ~r"priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$",
      ~r"lib/phoenix/live_dashboard/(live|views)/.*(ex)$",
      ~r"lib/phoenix/live_dashboard/templates/.*(ex)$"
    ]
  ]
)

defmodule DemoWeb.History do
  use GenServer
  alias Phoenix.LiveDashboard.TelemetryListener

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
    GenServer.cast(__MODULE__, {:metrics, metrics})
    {:ok, %{}}
  end

  @impl true
  def terminate(_, events) do
    for event <- events do
      :telemetry.detach({__MODULE__, event, self()})
    end

    :ok
  end

  defp attach_handler(%{name: name_list} = metric, id) do
    :telemetry.attach(
      "#{inspect(name_list)}-history-#{id}",
      Enum.slice(name_list, 0, length(name_list) - 1),
      &__MODULE__.handle_event/4,
      metric
    )
  end

  def handle_event(_event_name, data, metadata, metric) do
    measurement = TelemetryListener.extract_measurement(metric, data)
    label = TelemetryListener.tags_to_label(metric, metadata)
    GenServer.cast(__MODULE__, {:telemetry_metric, measurement, label, metric})
  end

  @impl true
  def handle_cast({:metrics, metrics}, _state) do
    metric_histories_map =
      metrics
      |> Enum.with_index()
      |> Enum.map(fn {metric, id} ->
        attach_handler(metric, id)
        {metric, CircularBuffer.new(@history_buffer_size)}
      end)
      |> Map.new()

    {:noreply, metric_histories_map}
  end

  @impl true
  def handle_cast({:telemetry_metric, measurement, label, metric}, state) do
    time = System.system_time(:microsecond)

    history = state[metric]

    new_history =
      CircularBuffer.insert(history, %{label: label, measurement: measurement, time: time})

    {:noreply, %{state | metric => new_history}}
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
    <a href="/dashboard" target="_blank">Open Dashboard</a>
    """)
  end

  def call(conn, :hello) do
    name = Map.get(conn.params, "name", "friend")
    content(conn, "<p>Hello, #{name}!</p>")
  end

  defp content(conn, content) do
    conn
    |> put_resp_header("content-type", "text/html")
    |> send_resp(200, "<!doctype html><html><body>#{content}</body></html>")
  end
end

defmodule DemoWeb.Router do
  use Phoenix.Router
  import Phoenix.LiveDashboard.Router

  pipeline :browser do
    plug :fetch_session
  end

  scope "/" do
    pipe_through :browser
    get "/", DemoWeb.PageController, :index
    get "/hello", DemoWeb.PageController, :hello
    get "/hello/:name", DemoWeb.PageController, :hello

    live_dashboard("/dashboard",
      metrics: DemoWeb.Telemetry,
      env_keys: ["USER", "ROOTDIR"],
      historical_data: {DemoWeb.History, :data, []}
    )
  end
end

defmodule DemoWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :phoenix_live_dashboard

  socket "/live", Phoenix.LiveView.Socket
  socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket

  plug Phoenix.LiveReloader
  plug Phoenix.CodeReloader

  plug Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"

  plug Plug.Session,
    store: :cookie,
    key: "_live_view_key",
    signing_salt: "/VEDsdfsffMnp5"

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]
  plug DemoWeb.Router
end

Application.ensure_all_started(:os_mon)
Application.put_env(:phoenix, :serve_endpoints, true)

Task.start(fn ->
  children = [
    {Phoenix.PubSub, [name: Demo.PubSub, adapter: Phoenix.PubSub.PG2]},
    DemoWeb.Endpoint,
    %{
      id: DemoWeb.History,
      start: {DemoWeb.History, :start_link, [DemoWeb.Telemetry.metrics()]}
    }
  ]

  {:ok, _} = Supervisor.start_link(children, strategy: :one_for_one)
  Process.sleep(:infinity)
end)
