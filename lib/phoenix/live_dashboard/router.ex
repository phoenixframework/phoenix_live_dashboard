defmodule Phoenix.LiveDashboard.Router do
  @moduledoc """
  Provides LiveView routing for LiveDashboard.
  """

  @doc """
  Defines a LiveDashboard route.

  It expects the `path` the dashboard will be mounted at
  and a set of options.

  ## Options

    * `:live_socket_path` - Configures the socket path. it must match
      the `socket "/live", Phoenix.LiveView.Socket` in your endpoint.

    * `:csp_nonce_assign_key` - an assign key to find the CSP nonce
      value used for assets
      Supports either `atom()` or
        `%{optional(:img) => atom(), optional(:script) => atom(), optional(:style) => atom()}`

    * `:ecto_repos` - the repositories to show database information.
      Currently only PSQL databases are supported

    * `:env_keys` - Configures environment variables to display.
      It is defined as a list of string keys. If not set, the environment
      information will not be displayed.

    * `:metrics` - Configures the module to retrieve metrics from.
      It can be a `module` or a `{module, function}`. If nothing is
      given, the metrics functionality will be disabled.

    * `:metrics_history` - Configures a callback for retreiving metric history.
      It must be an "MFA" tuple of  `{Module, :function, arguments}` such as
        metrics_history: {MyStorage, :metrics_history, []}
      If not set, metrics will start out empty/blank and only display
      data that occurs while the browser page is open.

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

    * `:additional_pages` - A keyword list of addictional pages

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
        import Phoenix.LiveView.Router, only: [live: 4]
        opts = Phoenix.LiveDashboard.Router.__options__(opts)

        # All helpers are public contracts and cannot be changed
        live "/", Phoenix.LiveDashboard.PageLive, :home, opts
        live "/:page", Phoenix.LiveDashboard.PageLive, :page, opts
        live "/:node/:page", Phoenix.LiveDashboard.PageLive, :page, opts
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

    ecto_repos = options[:ecto_repos]

    csp_nonce_assign_key =
      case options[:csp_nonce_assign_key] do
        nil -> nil
        key when is_atom(key) -> %{img: key, style: key, script: key}
        %{} = keys -> Map.take(keys, [:img, :style, :script])
      end

    allow_destructive_actions = options[:allow_destructive_actions] || false

    session_args = [
      env_keys,
      allow_destructive_actions,
      metrics,
      metrics_history,
      additional_pages,
      request_logger_cookie_domain,
      ecto_repos,
      csp_nonce_assign_key
    ]

    [
      session: {__MODULE__, :__session__, session_args},
      private: %{live_socket_path: live_socket_path, csp_nonce_assign_key: csp_nonce_assign_key},
      layout: {Phoenix.LiveDashboard.LayoutView, :dash},
      as: :live_dashboard
    ]
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
            "must be a tuple {path, {module, args}}, where path is a binary and " <>
            "the module implements Phoenix.LiveDashboard.PageBuilder, got: "

        raise ArgumentError, msg <> inspect(other)
    end)
  end

  @doc false
  def __session__(
        conn,
        env_keys,
        allow_destructive_actions,
        metrics,
        metrics_history,
        additional_pages,
        request_logger_cookie_domain,
        ecto_repos,
        csp_nonce_assign_key
      ) do
    metrics_session = %{
      "metrics" => metrics,
      "metrics_history" => metrics_history
    }

    request_logger_session = %{
      "request_logger" => Phoenix.LiveDashboard.RequestLogger.param_key(conn),
      "cookie_domain" => request_logger_cookie_domain
    }

    {pages, requirements} =
      [
        home: {Phoenix.LiveDashboard.HomePage, %{"env_keys" => env_keys}},
        os_mon: {Phoenix.LiveDashboard.OSMonPage, %{}},
        metrics: {Phoenix.LiveDashboard.MetricsPage, metrics_session},
        request_logger: {Phoenix.LiveDashboard.RequestLoggerPage, request_logger_session},
        applications: {Phoenix.LiveDashboard.ApplicationsPage, %{}},
        processes: {Phoenix.LiveDashboard.ProcessesPage, %{}},
        ports: {Phoenix.LiveDashboard.PortsPage, %{}},
        sockets: {Phoenix.LiveDashboard.SocketsPage, %{}},
        ets: {Phoenix.LiveDashboard.EtsPage, %{}}
      ]
      |> Enum.concat(ecto_stats(ecto_repos))
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

  defp ecto_stats(nil), do: [{:ecto_stats, {Phoenix.LiveDashboard.EctoStatsPage, %{repo: nil}}}]

  defp ecto_stats(repos) do
    for repo <- List.wrap(repos) do
      page =
        repo
        |> Macro.underscore()
        |> String.replace("/", "_")
        |> Kernel.<>("_info")
        |> String.to_atom()

      {page, {Phoenix.LiveDashboard.EctoStatsPage, %{repo: repo}}}
    end
  end

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
