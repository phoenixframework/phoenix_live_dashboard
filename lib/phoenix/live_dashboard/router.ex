defmodule Phoenix.LiveDashboard.Router do
  @moduledoc """
  Provides LiveView routing for LiveDashboard.
  """

  @doc """
  Defines a LiveDashboard route.

  It expects the `path` the dashboard will be mounted at
  and a set of options.

  This will also generate a named helper called `live_dashboard_path/2`
  which you can use to link directly to the dashboard, such as:

      <%= link "Dashboard", to: live_dashboard_path(conn, :home) %>

  Note you should only use `link/2` to link to the dashboard (and not
  `live_redirect/live_link`, as it has to set its own session on first
  render.

  ## Options

    * `:live_socket_path` - Configures the socket path. it must match
      the `socket "/live", Phoenix.LiveView.Socket` in your endpoint.

    * `:csp_nonce_assign_key` - an assign key to find the CSP nonce
      value used for assets. Supports either `atom()` or a map of
      type `%{optional(:img) => atom(), optional(:script) => atom(), optional(:style) => atom()}`

    * `:ecto_repos` - the repositories to show database information.
      Currently only PSQL databases are supported. If you don't specify
      but your app is running Ecto, we will try to auto-discover the
      available repositories. You can disable this behavior by setting
      `[]` to this option.

    * `:env_keys` - Configures environment variables to display.
      It is defined as a list of string keys. If not set, the environment
      information will not be displayed

    * `:home_app` - A tuple with the app name and version to show on
      the home page. Defaults to `{"Dashboard", :phoenix_live_dashboard}`

    * `:metrics` - Configures the module to retrieve metrics from.
      It can be a `module` or a `{module, function}`. If nothing is
      given, the metrics functionality will be disabled. If `false` is
      passed, then the menu item won't be visible.

    * `:metrics_history` - Configures a callback for retrieving metric history.
      It must be an "MFA" tuple of  `{Module, :function, arguments}` such as
        metrics_history: {MyStorage, :metrics_history, []}
      If not set, metrics will start out empty/blank and only display
      data that occurs while the browser page is open.

    * `:request_logger` - By default the Request Logger page is enabled. Passing
       `false` will disable this page.

    * `:request_logger_cookie_domain` - Configures the domain the request_logger
      cookie will be written to. It can be a string or `:parent` atom.
      When a string is given, it will directly  set cookie domain to the given
      value. When `:parent` is given, it will take the parent domain from current
      endpoint host (if host is "www.acme.com" the cookie will be scoped on
      "acme.com"). When not set, the cookie will be scoped to current domain.

    * `:allow_destructive_actions` - When true, allow destructive actions directly
      from the UI. Defaults to `false`. The following destructive actions are
      available in the dashboard:

        * "Kill process" - a "Kill process" button on the process modal

      Note that custom pages given to "Additional pages" may support their own
      destructive actions.

    * `:additional_pages` - A keyword list of additional pages

  ## Examples

      defmodule MyAppWeb.Router do
        use Phoenix.Router
        import Phoenix.LiveDashboard.Router

        scope "/", MyAppWeb do
          pipe_through [:browser]
          live_dashboard "/dashboard",
            metrics: {MyAppWeb.Telemetry, :metrics},
            env_keys: ["APP_USER", "VERSION"],
            metrics_history: {MyStorage, :metrics_history, []},
            request_logger_cookie_domain: ".acme.com"
        end
      end

  """
  defmacro live_dashboard(path, opts \\ []) do
    quote bind_quoted: binding() do
      scope path, alias: false, as: false do
        {session_name, session_opts, route_opts} = Phoenix.LiveDashboard.Router.__options__(opts)
        import Phoenix.LiveView.Router, only: [live: 4, live_session: 3]

        live_session session_name, session_opts do
          # All helpers are public contracts and cannot be changed
          live "/", Phoenix.LiveDashboard.PageLive, :home, route_opts
          live "/:page", Phoenix.LiveDashboard.PageLive, :page, route_opts
          live "/:node/:page", Phoenix.LiveDashboard.PageLive, :page, route_opts
        end
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

        false ->
          :skip

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

    home_app =
      case options[:home_app] do
        nil ->
          {"Dashboard", :phoenix_live_dashboard}

        {app_title, app_name} when is_binary(app_title) and is_atom(app_name) ->
          {app_title, app_name}

        other ->
          raise ArgumentError,
                ":home_app must be a tuple with a binary title and atom app, got: " <>
                  inspect(other)
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

    additional_pages =
      case options[:additional_pages] do
        nil ->
          []

        pages when is_list(pages) ->
          normalize_additional_pages(pages)

        other ->
          raise ArgumentError, ":additional_pages must be a keyword, got: " <> inspect(other)
      end

    request_logger_cookie_domain =
      case options[:request_logger_cookie_domain] do
        nil ->
          nil

        domain when is_binary(domain) ->
          domain

        :parent ->
          :parent

        other ->
          raise ArgumentError,
                ":request_logger_cookie_domain must be a binary or :parent atom, got: " <>
                  inspect(other)
      end

    request_logger_flag =
      case options[:request_logger] do
        nil ->
          true

        bool when is_boolean(bool) ->
          bool

        other ->
          raise ArgumentError,
                ":request_logger must be a boolean, got: " <> inspect(other)
      end

    request_logger = {request_logger_flag, request_logger_cookie_domain}

    ecto_repos = options[:ecto_repos]

    ecto_psql_extras_options =
      case options[:ecto_psql_extras_options] do
        nil ->
          []

        args ->
          unless Keyword.keyword?(args) and
                   args |> Keyword.values() |> Enum.all?(&Keyword.keyword?/1) do
            raise ArgumentError,
                  ":ecto_psql_extras_options must be a keyword where each value is a keyword, got: " <>
                    inspect(args)
          end

          args
      end

    csp_nonce_assign_key =
      case options[:csp_nonce_assign_key] do
        nil -> nil
        key when is_atom(key) -> %{img: key, style: key, script: key}
        %{} = keys -> Map.take(keys, [:img, :style, :script])
      end

    allow_destructive_actions = options[:allow_destructive_actions] || false

    session_args = [
      env_keys,
      home_app,
      allow_destructive_actions,
      metrics,
      metrics_history,
      additional_pages,
      request_logger,
      ecto_repos,
      ecto_psql_extras_options,
      csp_nonce_assign_key
    ]

    {
      options[:live_session_name] || :live_dashboard,
      [
        session: {__MODULE__, :__session__, session_args},
        root_layout: {Phoenix.LiveDashboard.LayoutView, :dash}
      ],
      [
        private: %{live_socket_path: live_socket_path, csp_nonce_assign_key: csp_nonce_assign_key},
        as: :live_dashboard
      ]
    }
  end

  defp normalize_additional_pages(pages) do
    Enum.map(pages, fn
      {path, module} when is_atom(path) and is_atom(module) ->
        {path, {module, []}}

      {path, {module, args}} when is_atom(path) and is_atom(module) ->
        {path, {module, args}}

      other ->
        msg =
          "invalid value in :additional_pages, " <>
            "must be a tuple {path, {module, args}} or {path, module}, where path " <>
            "is an atom and the module implements Phoenix.LiveDashboard.PageBuilder, got: "

        raise ArgumentError, msg <> inspect(other)
    end)
  end

  @doc false
  def __session__(
        conn,
        env_keys,
        home_app,
        allow_destructive_actions,
        metrics,
        metrics_history,
        additional_pages,
        request_logger,
        ecto_repos,
        ecto_psql_extras_options,
        csp_nonce_assign_key
      ) do
    ecto_session = %{
      repos: ecto_repos(ecto_repos),
      ecto_psql_extras_options: ecto_psql_extras_options
    }

    {pages, requirements} =
      [
        home: {Phoenix.LiveDashboard.HomePage, %{env_keys: env_keys, home_app: home_app}},
        os_mon: {Phoenix.LiveDashboard.OSMonPage, %{}}
      ]
      |> Enum.concat(metrics_page(metrics, metrics_history))
      |> Enum.concat(request_logger_page(conn, request_logger))
      |> Enum.concat(
        applications: {Phoenix.LiveDashboard.ApplicationsPage, %{}},
        processes: {Phoenix.LiveDashboard.ProcessesPage, %{}},
        ports: {Phoenix.LiveDashboard.PortsPage, %{}},
        sockets: {Phoenix.LiveDashboard.SocketsPage, %{}},
        ets: {Phoenix.LiveDashboard.EtsPage, %{}},
        ecto_stats: {Phoenix.LiveDashboard.EctoStatsPage, ecto_session}
      )
      |> Enum.concat(additional_pages)
      |> Enum.map(fn {key, {module, opts}} ->
        {session, requirements} = initialize_page(module, opts)
        {{key, {module, session}}, requirements}
      end)
      |> Enum.unzip()

    %{
      "pages" => pages,
      "allow_destructive_actions" => allow_destructive_actions,
      "requirements" => requirements |> Enum.concat() |> Enum.uniq(),
      "csp_nonces" => %{
        img: conn.assigns[csp_nonce_assign_key[:img]],
        style: conn.assigns[csp_nonce_assign_key[:style]],
        script: conn.assigns[csp_nonce_assign_key[:script]]
      }
    }
  end

  defp metrics_page(:skip, _), do: []

  defp metrics_page(metrics, metrics_history) do
    session = %{
      metrics: metrics,
      metrics_history: metrics_history
    }

    [metrics: {Phoenix.LiveDashboard.MetricsPage, session}]
  end

  defp request_logger_page(_conn, {false, _}), do: []

  defp request_logger_page(conn, {true, cookie_domain}) do
    session = %{
      request_logger: Phoenix.LiveDashboard.RequestLogger.param_key(conn),
      cookie_domain: cookie_domain
    }

    [request_logger: {Phoenix.LiveDashboard.RequestLoggerPage, session}]
  end

  defp ecto_repos(nil), do: nil
  defp ecto_repos(false), do: []
  defp ecto_repos(repos), do: List.wrap(repos)

  defp initialize_page(module, opts) do
    case module.init(opts) do
      {:ok, session} ->
        {session, []}

      {:ok, session, requirements} ->
        validate_requirements(module, requirements)
        {session, requirements}
    end
  end

  defp validate_requirements(module, requirements) do
    Enum.each(requirements, fn
      {key, value} when key in [:application, :module, :process] and is_atom(value) ->
        :ok

      other ->
        raise "unknown requirement #{inspect(other)} from #{inspect(module)}"
    end)
  end
end
