defmodule Phoenix.LiveDashboard.RouterTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.Router
  import Phoenix.ConnTest

  test "default options" do
    assert Router.__options__([]) == [
             session: {Phoenix.LiveDashboard.Router, :__session__, [nil, nil, nil, []]},
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
             {Phoenix.LiveDashboard.Router, :__session__, [{Foo, :metrics}, nil, nil, []]}

    assert Router.__options__(metrics: {Foo, :bar})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [{Foo, :bar}, nil, nil, []]}

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics: [])
    end
  end

  test "configures env_keys" do
    assert Router.__options__(env_keys: ["USER", "ROOTDIR"])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, ["USER", "ROOTDIR"], nil, []]}

    assert_raise ArgumentError, fn ->
      Router.__options__(env_keys: "FOO")
    end
  end

  test "accepts metrics_history option" do
    assert Router.__options__(metrics_history: {MyStorage, :metrics_history, []})[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__,
              [nil, nil, {MyStorage, :metrics_history, []}, []]}

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics_history: %{namespace: {MyStorage, :metrics_history, []}})
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(metrics_history: %{[:namespace, :metric] => MyStorage})
    end
  end

  test "configures additional_pages" do
    assert Router.__options__(additional_pages: [])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, nil, nil, []]}

    assert Router.__options__(additional_pages: [CustomPage])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, nil, nil, [{CustomPage, []}]]}

    assert Router.__options__(additional_pages: [{CustomPage, [1]}])[:session] ==
             {Phoenix.LiveDashboard.Router, :__session__, [nil, nil, nil, [{CustomPage, [1]}]]}

    assert_raise ArgumentError, fn ->
      Router.__options__(additional_pages: [{CustomPage, 1}])
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(additional_pages: [1])
    end

    assert_raise ArgumentError, fn ->
      Router.__options__(additional_pages: CustomPage)
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
                  {Phoenix.LiveDashboard.RequestLoggerPage, %{"request_logger" => nil}}},
                 {"applications", {Phoenix.LiveDashboard.ApplicationsPage, %{}}},
                 {"processes", {Phoenix.LiveDashboard.ProcessesPage, %{}}},
                 {"ports", {Phoenix.LiveDashboard.PortsPage, %{}}},
                 {"sockets", {Phoenix.LiveDashboard.SocketsPage, %{}}},
                 {"ets", {Phoenix.LiveDashboard.EtsPage, %{}}}
               ],
               "requirements" => [{:application, :os_mon}]
             } = Phoenix.LiveDashboard.Router.__session__(build_conn(), [], [], [], [])
    end
  end
end
