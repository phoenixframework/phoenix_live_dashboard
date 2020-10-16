defmodule Phoenix.LiveDashboard.RouterTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.Router
  import Phoenix.ConnTest

  test "default options" do
    assert Router.__options__([]) == [
             session:
               {Phoenix.LiveDashboard.Router, :__session__, [nil, false, nil, nil, [], nil, nil]},
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
             %{live_socket_path: "/custom/live", csp_nonce_assign_key: :csp_nonce}
  end

  test "configures metrics" do
    assert Router.__options__(metrics: Foo)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, {Foo, :metrics}, nil, [], nil, nil]}

    assert Router.__options__(metrics: {Foo, :bar})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, {Foo, :bar}, nil, [], nil, nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics: [])
    end
  end

  test "configures env_keys" do
    assert Router.__options__(env_keys: ["USER", "ROOTDIR"])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [["USER", "ROOTDIR"], false, nil, nil, [], nil, nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(env_keys: "FOO")
    end
  end

  test "accepts metrics_history option" do
    assert Router.__options__(metrics_history: {MyStorage, :metrics_history, []})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, {MyStorage, :metrics_history, []}, [], nil, nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics_history: %{namespace: {MyStorage, :metrics_history, []}})
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics_history: %{[:namespace, :metric] => MyStorage})
    end
  end

  test "configures additional_pages" do
    assert Router.__options__(additional_pages: [])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, false, nil, nil, [], nil, nil]}

    assert Router.__options__(additional_pages: [{"custom", CustomPage}])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [{"custom", {CustomPage, %{}}}], nil, nil]}

    assert Router.__options__(additional_pages: [{"custom", {CustomPage, [1]}}])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [{"custom", {CustomPage, [1]}}], nil, nil]}

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

  test "configures cookie_domain" do
    assert Router.__options__(request_logger_cookie_domain: nil)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, false, nil, nil, [], nil, nil]}

    assert Router.__options__(request_logger_cookie_domain: ".acme.com")[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [], ".acme.com", nil]}

    assert Router.__options__(request_logger_cookie_domain: :parent)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, false, nil, nil, [], :parent, nil]}

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
                 ecto_info: {Phoenix.LiveDashboard.EctoInfoPage, %{repo: nil}}
               ],
               "requirements" => [{:application, :os_mon}]
             } =
               build_conn()
               |> Phoenix.LiveDashboard.Router.__session__([], false, [], [], [], nil, nil)
    end

    test "generates additional pages per ecto repo" do
      assert %{"pages" => pages} =
               build_conn()
               |> Phoenix.LiveDashboard.Router.__session__([], false, [], [], [], nil, [])

      assert [ets: _] = Enum.take(pages, -1)

      repos = [Foo, Bar.Baz]

      assert %{"pages" => pages} =
               build_conn()
               |> Phoenix.LiveDashboard.Router.__session__([], false, [], [], [], nil, repos)

      assert [
               ets: _,
               foo_info: {Phoenix.LiveDashboard.EctoInfoPage, %{repo: Foo}},
               bar_baz_info: {Phoenix.LiveDashboard.EctoInfoPage, %{repo: Bar.Baz}}
             ] = Enum.take(pages, -3)
    end
  end
end
