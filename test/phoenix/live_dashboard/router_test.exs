defmodule Phoenix.LiveDashboard.RouterTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.Router
  import Phoenix.ConnTest

  test "default options" do
    assert Router.__options__([]) == [
             session: {Phoenix.LiveDashboard.Router, :__session__, [nil, nil, nil, [], nil]},
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
             {Phoenix.LiveDashboard.Router, :__session__, [{Foo, :metrics}, nil, nil, [], nil]}

    assert Router.__options__(metrics: {Foo, :bar})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [{Foo, :bar}, nil, nil, [], nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics: [])
    end
  end

  test "configures env_keys" do
    assert Router.__options__(env_keys: ["USER", "ROOTDIR"])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, ["USER", "ROOTDIR"], nil, [], nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(env_keys: "FOO")
    end
  end

  test "accepts metrics_history option" do
    assert Router.__options__(metrics_history: {MyStorage, :metrics_history, []})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, nil, {MyStorage, :metrics_history, []}, [], nil]}

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics_history: %{namespace: {MyStorage, :metrics_history, []}})
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics_history: %{[:namespace, :metric] => MyStorage})
    end
  end

  test "configures additional_pages" do
    assert Router.__options__(additional_pages: [])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, nil, nil, [], nil]}

    assert Router.__options__(additional_pages: [{"custom", CustomPage}])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, nil, nil, [{"custom", {CustomPage, %{}}}], nil]}

    assert Router.__options__(additional_pages: [{"custom", {CustomPage, [1]}}])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, nil, nil, [{"custom", {CustomPage, [1]}}], nil]}

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

  test "configures request_logger_cookie_domain" do
    assert Router.__options__(request_logger_cookie_domain: nil)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, nil, nil, [], nil]}

    assert Router.__options__(request_logger_cookie_domain: ".acme.com")[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, nil, nil, [], ".acme.com"]}

    assert Router.__options__(request_logger_cookie_domain: :parent)[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, nil, nil, [], :parent]}

    assert_raise ArgumentError, fn ->
      Router.__options__(request_logger_cookie_domain: :unknown_atom)
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(request_logger_cookie_domain: [])
    end
  end

  describe "__session__/5" do
    test "generates pages & requirements" do
      assert %{
               "pages" => [
                 {"home", {Phoenix.LiveDashboard.HomePage, %{"env_keys" => []}}},
                 {"os_mon", {Phoenix.LiveDashboard.OSMonPage, %{}}},
                 {"metrics",
                  {Phoenix.LiveDashboard.MetricsPage, %{"metrics" => [], "metrics_history" => []}}},
                 {"request_logger",
                  {Phoenix.LiveDashboard.RequestLoggerPage,
                   %{"request_logger" => nil, "request_logger_cookie_domain" => nil}}},
                 {"applications", {Phoenix.LiveDashboard.ApplicationsPage, %{}}},
                 {"processes", {Phoenix.LiveDashboard.ProcessesPage, %{}}},
                 {"ports", {Phoenix.LiveDashboard.PortsPage, %{}}},
                 {"sockets", {Phoenix.LiveDashboard.SocketsPage, %{}}},
                 {"ets", {Phoenix.LiveDashboard.EtsPage, %{}}}
               ],
               "requirements" => [{:application, :os_mon}]
             } = Phoenix.LiveDashboard.Router.__session__(build_conn(), [], [], [], [], nil)
    end
  end
end
