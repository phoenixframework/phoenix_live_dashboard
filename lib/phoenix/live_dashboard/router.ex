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

  ## Examples

      defmodule MyAppWeb.Router do
        use Phoenix.Router
        import Phoenix.LiveDashboard.Router

        scope "/", MyAppWeb do
          pipe_through [:browser]
          live_dashboard "/dashboard",
            metrics: {MyAppWeb.Telemetry, :metrics},
            env_keys: ["APP_USER", "VERSION"]
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
                ":env_keys must be a list of strings, got: #{inspect(other)}"
      end

    historical_data =
      case options[:historical_data] do
        nil ->
          nil

        map when is_map(map) ->
          if Enum.all?(map, fn {list, tuple} -> is_list(list) and is_tuple(tuple) end) do
            map
          else
            raise ArgumentError, historical_data_error(map)
          end

        other ->
          raise ArgumentError, historical_data_error(other)
      end

    [
      session: {__MODULE__, :__session__, [metrics, env_keys, historical_data]},
      private: %{live_socket_path: live_socket_path},
      layout: {Phoenix.LiveDashboard.LayoutView, :dash},
      as: :live_dashboard
    ]
  end

  @doc false
  def __session__(conn, metrics, env_keys, historical_data) do
    %{
      "metrics" => metrics,
      "env_keys" => env_keys,
      "historical_data" => historical_data,
      "request_logger" => Phoenix.LiveDashboard.RequestLogger.param_key(conn)
    }
  end

  defp historical_data_error(other) do
    """
      :historical_data must be a map with lists of atoms as keys and
      tuples of {Module, :function, list} as values such as

      historical_data: %{
        [:my_app, :repo] =>
          {MyStorage, :historical_metric_data, []}
      }
      , got: #{inspect(other)}
    """
  end
end
