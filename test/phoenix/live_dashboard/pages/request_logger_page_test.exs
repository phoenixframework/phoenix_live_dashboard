defmodule Phoenix.LiveDashboard.RequestLoggerPageTest do
  use ExUnit.Case, async: true

  require Logger
  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  alias Phoenix.LiveDashboard.RequestLogger
  alias Phoenix.LiveDashboardTest.PubSub
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "menu_link/2" do
    assert :skip =
             Phoenix.LiveDashboard.RequestLoggerPage.menu_link(%{}, %{dashboard_running?: false})

    link = "https://hexdocs.pm/phoenix_live_dashboard/request_logger.html"

    assert {:disabled, "Request Logger", ^link} =
             Phoenix.LiveDashboard.RequestLoggerPage.menu_link(
               %{request_logger: nil},
               %{dashboard: true}
             )

    assert {:ok, "Request Logger"} =
             Phoenix.LiveDashboard.RequestLoggerPage.menu_link(
               %{request_logger: {"param", "cookie"}},
               %{dashboard: true}
             )
  end

  test "redirects to stream" do
    {:error, {:live_redirect, %{to: "/dashboard/request_logger?stream=" <> _}}} =
      live(build_conn(), "/dashboard/request_logger")
  end

  test "redirects to stream keeping host" do
    {:error, {:live_redirect, %{to: "/dashboard/nonode%40nohost/request_logger?stream=" <> _}}} =
      live(build_conn(), "/dashboard/nonode@nohost/request_logger")
  end

  @tag :capture_log
  test "receives log messages on stream" do
    {:ok, live, _} = live(build_conn(), "/dashboard/request_logger?stream=sample")
    assert render(live) =~ "request_logger_param_key="
    assert render(live) =~ "Enable cookie"

    Logger.error("hello world", logger_pubsub_backend: {PubSub, RequestLogger.topic("sample")})
    Logger.flush()

    # Guarantees the message above has been processed
    _ = render(live)

    # Guarantees the stream has arrived
    assert render(live) =~ ~s|[error] hello world\n</pre>|
  end

  test "does not include cookie domain by default" do
    {:ok, live, _} = live(build_conn(), "/dashboard/request_logger?stream=sample")
    refute render(live) =~ "data-cookie-domain"
  end

  test "includes cookie domain when configured" do
    {:ok, live, _} = live(build_conn(), "/config/nonode@nohost/request_logger?stream=sample")
    assert render(live) =~ "data-cookie-domain=\"my.domain\""
  end

  test "includes cookie domain from parent" do
    url = "/parent_cookie_domain/nonode@nohost/request_logger?stream=sample"

    {:ok, live, _} = live(%{build_conn() | host: "localhost"}, url)
    assert render(live) =~ "data-cookie-domain=\"localhost\""

    {:ok, live, _} = live(%{build_conn() | host: "foo.example.com"}, url)
    assert render(live) =~ "data-cookie-domain=\"example.com\""
  end
end
