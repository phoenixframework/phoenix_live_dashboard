defmodule Phoenix.LiveDashboard.RouterTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.Router
  import Phoenix.ConnTest

  defp session_opts(opts), do: Router.__options__(opts) |> elem(1)
  defp route_opts(opts), do: Router.__options__(opts) |> elem(2)

  @home_app {"Dashboard", :phoenix_live_dashboard}

  test "generates helper for home" do
    assert Phoenix.LiveDashboardTest.Router.Helpers.live_dashboard_path(build_conn(), :home) ==
             "/dashboard"
  end

  test "default session options" do
    assert session_opts([]) == [
             session:
               {Phoenix.LiveDashboard.Router, :__session__,
                [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], [], nil]},
             root_layout: {Phoenix.LiveDashboard.LayoutView, :dash},
             on_mount: nil
           ]
  end

  test "default route options" do
    assert route_opts([]) == [
             private: %{live_socket_path: "/live", csp_nonce_assign_key: nil},
             as: :live_dashboard
           ]
  end

  test "configures on_mount" do
    assert session_opts(on_mount: [{Foo, :bar}])[:on_mount] == [{Foo, :bar}]
  end

  test "configures live_socket_path" do
    assert route_opts(
             live_socket_path: "/custom/live",
             csp_nonce_assign_key: :csp_nonce
           )[:private] ==
             %{
               live_socket_path: "/custom/live",
               csp_nonce_assign_key: %{
                 style: :csp_nonce,
                 script: :csp_nonce
               }
             }
  end

  test "configures csp in detail" do
    assert route_opts(
             live_socket_path: "/custom/live",
             csp_nonce_assign_key: %{
               style: :style_csp_nonce,
               script: :script_csp_nonce,
               other: :unused
             }
           )[:private] ==
             %{
               live_socket_path: "/custom/live",
               csp_nonce_assign_key: %{
                 style: :style_csp_nonce,
                 script: :script_csp_nonce
               }
             }
  end

  test "configures metrics" do
    assert session_opts(metrics: Foo)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, {Foo, :metrics}, nil, [], {true, nil}, nil, [], [], [], nil]}

    assert session_opts(metrics: {Foo, :bar})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, {Foo, :bar}, nil, [], {true, nil}, nil, [], [], [], nil]}

    assert session_opts(metrics: false)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, :skip, nil, [], {true, nil}, nil, [], [], [], nil]}

    assert_raise ArgumentError, fn ->
      session_opts(metrics: [])
    end
  end

  test "configures env_keys" do
    assert session_opts(env_keys: ["USER", "ROOTDIR"])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [
                ["USER", "ROOTDIR"],
                @home_app,
                false,
                nil,
                nil,
                [],
                {true, nil},
                nil,
                [],
                [],
                [],
                nil
              ]}

    assert_raise ArgumentError, fn ->
      session_opts(env_keys: "FOO")
    end
  end

  test "accepts metrics_history option" do
    assert session_opts(metrics_history: {MyStorage, :metrics_history, []})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [
                nil,
                @home_app,
                false,
                nil,
                {MyStorage, :metrics_history, []},
                [],
                {true, nil},
                nil,
                [],
                [],
                [],
                nil
              ]}

    assert_raise ArgumentError, fn ->
      session_opts(metrics_history: %{namespace: {MyStorage, :metrics_history, []}})
    end

    assert_raise ArgumentError, fn ->
      session_opts(metrics_history: %{[:namespace, :metric] => MyStorage})
    end
  end

  test "configures additional_pages" do
    assert session_opts(additional_pages: [])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], [], nil]}

    assert session_opts(additional_pages: [custom: CustomPage])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [
                nil,
                @home_app,
                false,
                nil,
                nil,
                [custom: {CustomPage, []}],
                {true, nil},
                nil,
                [],
                [],
                [],
                nil
              ]}

    assert session_opts(additional_pages: [custom: {CustomPage, [1]}])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [
                nil,
                @home_app,
                false,
                nil,
                nil,
                [custom: {CustomPage, [1]}],
                {true, nil},
                nil,
                [],
                [],
                [],
                nil
              ]}

    assert_raise ArgumentError, fn ->
      session_opts(additional_pages: [{CustomPage, 1}])
    end

    assert_raise ArgumentError, fn ->
      session_opts(additional_pages: [1])
    end

    assert_raise ArgumentError, fn ->
      session_opts(additional_pages: {"custom", CustomPage})
    end
  end

  test "configures cookie_domain" do
    assert session_opts(request_logger_cookie_domain: nil)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], [], nil]}

    assert session_opts(request_logger_cookie_domain: ".acme.com")[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, ".acme.com"}, nil, [], [], [], nil]}

    assert session_opts(request_logger_cookie_domain: :parent)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, :parent}, nil, [], [], [], nil]}

    assert_raise ArgumentError, fn ->
      session_opts(request_logger_cookie_domain: :unknown_atom)
    end

    assert_raise ArgumentError, fn ->
      session_opts(request_logger_cookie_domain: [])
    end
  end

  test "configures request logger" do
    assert session_opts(request_logger: false)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {false, nil}, nil, [], [], [], nil]}

    assert session_opts(request_logger: true)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], [], nil]}

    assert_raise ArgumentError, fn ->
      session_opts(request_logger: :something_else)
    end
  end

  test "configures ecto_psql_extras" do
    assert session_opts(ecto_psql_extras_options: nil)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], [], nil]}

    assert session_opts(ecto_psql_extras_options: [])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], [], nil]}

    ecto_args = [long_running_queries: [threshold: 200]]

    assert session_opts(ecto_psql_extras_options: ecto_args)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, ecto_args, [], [], nil]}

    assert_raise ArgumentError, fn ->
      session_opts(ecto_psql_extras_options: :not_a_list)
    end

    assert_raise ArgumentError, fn ->
      session_opts(ecto_psql_extras_options: [long_running_queries: :not_a_list])
    end

    assert_raise ArgumentError, fn ->
      session_opts(ecto_psql_extras_options: [long_running_queries: [:not_a_keyword]])
    end
  end

  test "configures ecto_mysql_extras" do
    assert session_opts(ecto_mysql_extras_options: nil)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], [], nil]}

    assert session_opts(ecto_mysql_extras_options: [])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], [], nil]}

    ecto_args = [long_running_queries: [threshold: 200]]

    assert session_opts(ecto_mysql_extras_options: ecto_args)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], ecto_args, [], nil]}

    assert_raise ArgumentError, fn ->
      session_opts(ecto_mysql_extras_options: :not_a_list)
    end

    assert_raise ArgumentError, fn ->
      session_opts(ecto_mysql_extras_options: [long_running_queries: :not_a_list])
    end

    assert_raise ArgumentError, fn ->
      session_opts(ecto_mysql_extras_options: [long_running_queries: [:not_a_keyword]])
    end
  end

  test "configures ecto_sqlite3_extras" do
    assert session_opts(ecto_sqlite3_extras_options: nil)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], [], nil]}

    assert session_opts(ecto_sqlite3_extras_options: [])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], [], nil]}

    ecto_args = [long_running_queries: [threshold: 200]]

    assert session_opts(ecto_sqlite3_extras_options: ecto_args)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, @home_app, false, nil, nil, [], {true, nil}, nil, [], [], ecto_args, nil]}

    assert_raise ArgumentError, fn ->
      session_opts(ecto_sqlite3_extras_options: :not_a_list)
    end

    assert_raise ArgumentError, fn ->
      session_opts(ecto_sqlite3_extras_options: [long_running_queries: :not_a_list])
    end

    assert_raise ArgumentError, fn ->
      session_opts(ecto_sqlite3_extras_options: [long_running_queries: [:not_a_keyword]])
    end
  end

  describe "__session__" do
    defp csp_session(conn, csp_session \\ nil) do
      Phoenix.LiveDashboard.Router.__session__(
        conn,
        [],
        @home_app,
        false,
        [],
        [],
        [],
        {true, nil},
        nil,
        [],
        [],
        [],
        csp_session
      )
    end

    test "generates pages & requirements" do
      assert %{
               "allow_destructive_actions" => false,
               "pages" => [
                 home: {Phoenix.LiveDashboard.HomePage, %{env_keys: [], home_app: @home_app}},
                 os_mon: {Phoenix.LiveDashboard.OSMonPage, %{}},
                 memory_allocators: {Phoenix.LiveDashboard.MemoryAllocatorsPage, %{}},
                 metrics:
                   {Phoenix.LiveDashboard.MetricsPage, %{metrics: [], metrics_history: []}},
                 request_logger:
                   {Phoenix.LiveDashboard.RequestLoggerPage,
                    %{request_logger: nil, cookie_domain: nil}},
                 applications: {Phoenix.LiveDashboard.ApplicationsPage, %{}},
                 processes: {Phoenix.LiveDashboard.ProcessesPage, %{}},
                 ports: {Phoenix.LiveDashboard.PortsPage, %{}},
                 sockets: {Phoenix.LiveDashboard.SocketsPage, %{}},
                 ets: {Phoenix.LiveDashboard.EtsPage, %{}},
                 ecto_stats:
                   {Phoenix.LiveDashboard.EctoStatsPage,
                    %{
                      repos: :auto_discover,
                      ecto_options: [
                        {:ecto_psql_extras_options, []},
                        {:ecto_mysql_extras_options, []},
                        {:ecto_sqlite3_extras_options, []}
                      ]
                    }}
               ],
               "requirements" => [{:application, :os_mon}]
             } = csp_session(build_conn())
    end

    test "loads nonces when key present" do
      assert %{
               "csp_nonces" => %{script: "script_nonce", style: "style_nonce"}
             } =
               build_conn()
               |> Plug.Conn.assign(:style_nonce, "style_nonce")
               |> Plug.Conn.assign(:script_nonce, "script_nonce")
               |> csp_session(%{
                 style: :style_nonce,
                 script: :script_nonce
               })
    end

    test "loads nil nonces when assign present" do
      assert %{
               "csp_nonces" => %{script: nil, style: nil}
             } =
               build_conn()
               |> csp_session(%{
                 style: :style_nonce,
                 script: :script_nonce
               })
    end

    test "loads nil nonces when key absent" do
      assert %{
               "csp_nonces" => %{script: nil, style: nil}
             } =
               build_conn()
               |> Plug.Conn.assign(:style_nonce, "style_nonce")
               |> Plug.Conn.assign(:script_nonce, "script_nonce")
               |> csp_session()
    end
  end
end
