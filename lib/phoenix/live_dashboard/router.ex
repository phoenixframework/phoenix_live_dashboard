defmodule Phoenix.LiveDashboard.Router do
  @moduledoc """
  Provides LiveView routing for LiveDashboard.
  """

  @doc """
  Defines a LiveDashboard route.

  It expects the `path` the dashboard will be mounted at
  and a set of options.

  ## Options

    * `:metrics` - Configures the module to retrieve metrics from.
      It can be a `module` or a `{module, function}`. If nothing is
      given, the metrics functionality will be disabled.

    * `:env_keys` - Configures environment variables to display.
      It is defined as a list of string keys. If not set, the environment
      information will not be displayed.

    * `:live_socket_path` - Configures the socket path. it must match
      the `socket "/live", Phoenix.LiveView.Socket` in your endpoint.

    * `:metrics_history` - Configures a callback for retreiving metric history.
      It must be an "MFA" tuple of  `{Module, :function, arguments}` such as
        metrics_history: {MyStorage, :metrics_history, []}
      If not set, metrics will start out empty/blank and only display
      data that occurs while the browser page is open.

  ## Examples

      defmodule MyAppWeb.Router do
        use Phoenix.Router
        import Phoenix.LiveDashboard.Router

        scope "/", MyAppWeb do
          pipe_through [:browser]
          live_dashboard "/dashboard",
            metrics: {MyAppWeb.Telemetry, :metrics},
            env_keys: ["APP_USER", "VERSION"],
            metrics_history: {MyStorage, :metrics_history, []}
        end
      end

  """
  defmacro live_dashboard(path, opts \\ []) do
    quote bind_quoted: binding() do
      scope path, alias: false, as: false do
        import Phoenix.LiveView.Router, only: [live: 4]

        opts = Phoenix.LiveDashboard.Router.__options__(opts)
        live "/", Phoenix.LiveDashboard.HomeLive, :home, opts
        live "/:node/home", Phoenix.LiveDashboard.HomeLive, :home, opts
        live "/:node/os_mon", Phoenix.LiveDashboard.OSMonLive, :os_mon, opts
        live "/:node/metrics", Phoenix.LiveDashboard.MetricsLive, :metrics, opts
        live "/:node/applications", Phoenix.LiveDashboard.ApplicationsLive, :applications, opts
        live "/:node/processes", Phoenix.LiveDashboard.ProcessesLive, :processes, opts
        live "/:node/ports", Phoenix.LiveDashboard.PortsLive, :ports, opts
        live "/:node/sockets", Phoenix.LiveDashboard.SocketsLive, :sockets, opts
        live "/:node/ets", Phoenix.LiveDashboard.EtsLive, :ets, opts

        live "/:node/request_logger",
             Phoenix.LiveDashboard.RequestLoggerLive,
             :request_logger,
             opts

        # Catch-all for URL generation
        live "/:node/:page", Phoenix.LiveDashboard.HomeLive, :page, opts
      end
    end
  end

  @doc false
  def __options__(options) do
    live_socket_path = Keyword.get(options, :live_socket_path, "/live")

    metrics =
      case options[:metrics] do
        nil ->
          nil

        mod when is_atom(mod) ->
          {mod, :metrics}

        {mod, fun} when is_atom(mod) and is_atom(fun) ->
          {mod, fun}

        other ->
          raise ArgumentError,
                ":metrics must be a tuple with {Mod, fun}, " <>
                  "such as {MyAppWeb.Telemetry, :metrics}, got: #{inspect(other)}"
      end

    env_keys =
      case options[:env_keys] do
        nil ->
          nil

        keys when is_list(keys) ->
          keys

        other ->
          raise ArgumentError,
                ":env_keys must be a list of strings, got: " <> inspect(other)
      end

    metrics_history =
      case options[:metrics_history] do
        nil ->
          nil

        {module, function, args}
        when is_atom(module) and is_atom(function) and is_list(args) ->
          {module, function, args}

        other ->
          raise ArgumentError,
                ":metrics_history must be a tuple of {module, function, args}, got: " <>
                  inspect(other)
      end

    [
      session: {__MODULE__, :__session__, [metrics, env_keys, metrics_history]},
      private: %{live_socket_path: live_socket_path},
      layout: {Phoenix.LiveDashboard.LayoutView, :dash},
      as: :live_dashboard
    ]
  end

  @doc false
  def __session__(conn, metrics, env_keys, metrics_history) do
    %{
      "metrics" => metrics,
      "env_keys" => env_keys,
      "metrics_history" => metrics_history,
      "request_logger" => Phoenix.LiveDashboard.RequestLogger.param_key(conn)
    }
  end
end
