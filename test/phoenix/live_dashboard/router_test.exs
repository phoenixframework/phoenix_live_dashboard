defmodule Phoenix.LiveDashboard.RouterTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.Router
  import Phoenix.ConnTest

  test "generates helper for home" do
    assert Phoenix.LiveDashboardTest.Router.Helpers.live_dashboard_path(build_conn(), :home) ==
             "/dashboard"
  end

  test "default options" do
    assert Router.__options__([]) == [
             session:
               {Phoenix.LiveDashboard.Router, :__session__,
                [nil, false, nil, nil, [], [], nil, nil, nil]},
             private: %{live_socket_path: "/live", csp_nonce_assign_key: nil},
             layout: {Phoenix.LiveDashboard.LayoutView, :dash},
             as: :live_dashboard
           ]
  end

  test "configures live_socket_path" do
    assert Router.__options__(
             live_socket_path: "/custom/live",
             csp_nonce_assign_key: :csp_nonce
           )[:private] ==
             %{
               live_socket_path: "/custom/live",
               csp_nonce_assign_key: %{
                 img: :csp_nonce,
                 style: :csp_nonce,
                 script: :csp_nonce
               }
             }
  end

  test "configures csp in detail" do
    assert Router.__options__(
             live_socket_path: "/custom/live",
             csp_nonce_assign_key: %{
               img: :img_csp_none,
               style: :style_csp_none,
               script: :script_csp_none,
               other: :unused
             }
           )[:private] ==
             %{
               live_socket_path: "/custom/live",
               csp_nonce_assign_key: %{
                 img: :img_csp_none,
                 style: :style_csp_none,
                 script: :script_csp_none
               }
             }
  end

  test "configures metrics" do
    assert Router.__options__(metrics: Foo)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, {Foo, :metrics}, nil, [], [], nil, nil, nil]}

    assert Router.__options__(metrics: {Foo, :bar})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, {Foo, :bar}, nil, [], [], nil, nil, nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics: [])
    end
  end

  test "configures env_keys" do
    assert Router.__options__(env_keys: ["USER", "ROOTDIR"])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [["USER", "ROOTDIR"], false, nil, nil, [], [], nil, nil, nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(env_keys: "FOO")
    end
  end

  test "accepts metrics_history option" do
    assert Router.__options__(metrics_history: {MyStorage, :metrics_history, []})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, {MyStorage, :metrics_history, []}, [], [], nil, nil, nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics_history: %{namespace: {MyStorage, :metrics_history, []}})
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics_history: %{[:namespace, :metric] => MyStorage})
    end
  end

  test "configures additional_pages" do
    assert Router.__options__(additional_pages: [])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [], [], nil, nil, nil]}

    assert Router.__options__(additional_pages: [custom: CustomPage])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [custom: {CustomPage, []}], [], nil, nil, nil]}

    assert Router.__options__(additional_pages: [custom: {CustomPage, [1]}])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [custom: {CustomPage, [1]}], [], nil, nil, nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(additional_pages: [{CustomPage, 1}])
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(additional_pages: [1])
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(additional_pages: {"custom", CustomPage})
    end
  end

  test "configures excluded pages" do
    assert Router.__options__(excluded_pages: [])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [], [], nil, nil, nil]}

    assert Router.__options__(excluded_pages: [:ets])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [], [:ets], nil, nil, nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(excluded_pages: :test)
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(excluded_pages: [1])
    end
  end

  test "configures cookie_domain" do
    assert Router.__options__(request_logger_cookie_domain: nil)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [], [], nil, nil, nil]}

    assert Router.__options__(request_logger_cookie_domain: ".acme.com")[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [], [], ".acme.com", nil, nil]}

    assert Router.__options__(request_logger_cookie_domain: :parent)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [], [], :parent, nil, nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(request_logger_cookie_domain: :unknown_atom)
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(request_logger_cookie_domain: [])
    end
  end

  describe "__session__" do
    test "generates pages & requirements" do
      assert %{
               "allow_destructive_actions" => false,
               "pages" => [
                 home: {Phoenix.LiveDashboard.HomePage, %{"env_keys" => []}},
                 os_mon: {Phoenix.LiveDashboard.OSMonPage, %{}},
                 metrics:
                   {Phoenix.LiveDashboard.MetricsPage,
                    %{"metrics" => [], "metrics_history" => []}},
                 request_logger:
                   {Phoenix.LiveDashboard.RequestLoggerPage,
                    %{"request_logger" => nil, "cookie_domain" => nil}},
                 applications: {Phoenix.LiveDashboard.ApplicationsPage, %{}},
                 processes: {Phoenix.LiveDashboard.ProcessesPage, %{}},
                 ports: {Phoenix.LiveDashboard.PortsPage, %{}},
                 sockets: {Phoenix.LiveDashboard.SocketsPage, %{}},
                 ets: {Phoenix.LiveDashboard.EtsPage, %{}},
                 ecto_stats: {Phoenix.LiveDashboard.EctoStatsPage, %{repo: nil}}
               ],
               "requirements" => [{:application, :os_mon}]
             } =
               build_conn()
               |> Phoenix.LiveDashboard.Router.__session__(
                 [],
                 false,
                 [],
                 [],
                 [],
                 [],
                 nil,
                 nil,
                 nil
               )
    end

    test "loads nonces when key present" do
      assert %{
               "csp_nonces" => %{img: "img_nonce", script: "script_nonce", style: "style_nonce"}
             } =
               build_conn()
               |> Plug.Conn.assign(:img_nonce, "img_nonce")
               |> Plug.Conn.assign(:style_nonce, "style_nonce")
               |> Plug.Conn.assign(:script_nonce, "script_nonce")
               |> Phoenix.LiveDashboard.Router.__session__([], false, [], [], [], [], nil, nil, %{
                 img: :img_nonce,
                 style: :style_nonce,
                 script: :script_nonce
               })
    end

    test "loads nil nonces when assign present" do
      assert %{
               "csp_nonces" => %{img: nil, script: nil, style: nil}
             } =
               build_conn()
               |> Phoenix.LiveDashboard.Router.__session__([], false, [], [], [], [], nil, nil, %{
                 img: :img_nonce,
                 style: :style_nonce,
                 script: :script_nonce
               })
    end

    test "loads nil nonces when key absent" do
      assert %{
               "csp_nonces" => %{img: nil, script: nil, style: nil}
             } =
               build_conn()
               |> Plug.Conn.assign(:img_nonce, "img_nonce")
               |> Plug.Conn.assign(:style_nonce, "style_nonce")
               |> Plug.Conn.assign(:script_nonce, "script_nonce")
               |> Phoenix.LiveDashboard.Router.__session__(
                 [],
                 false,
                 [],
                 [],
                 [],
                 [],
                 nil,
                 nil,
                 nil
               )
    end

    test "generates additional pages per ecto repo" do
      assert %{"pages" => pages} =
               build_conn()
               |> Phoenix.LiveDashboard.Router.__session__(
                 [],
                 false,
                 [],
                 [],
                 [],
                 [],
                 nil,
                 [],
                 nil
               )

      assert [ets: _] = Enum.take(pages, -1)

      repos = [Foo, Bar.Baz]

      assert %{"pages" => pages} =
               build_conn()
               |> Phoenix.LiveDashboard.Router.__session__(
                 [],
                 false,
                 [],
                 [],
                 [],
                 [],
                 nil,
                 repos,
                 nil
               )

      assert [
               ets: _,
               foo_info: {Phoenix.LiveDashboard.EctoStatsPage, %{repo: Foo}},
               bar_baz_info: {Phoenix.LiveDashboard.EctoStatsPage, %{repo: Bar.Baz}}
             ] = Enum.take(pages, -3)
    end
  end
end
