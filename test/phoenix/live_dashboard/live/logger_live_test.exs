defmodule Phoenix.LiveDashboard.LoggerLiveTest do
  use ExUnit.Case, async: true

  require Logger
  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  alias Phoenix.LiveDashboard.RequestLogger
  alias Phoenix.LiveDashboardTest.PubSub
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "redirects to stream" do
    {:error, %{redirect: %{to: "/dashboard/nonode%40nohost/request_logger/" <> _}}} =
      live(build_conn(), "/dashboard/nonode@nohost/request_logger")
  end

  @tag :capture_log
  test "receives log messages on stream" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/request_logger/sample")
    assert render(live) =~ "?request_logger_param_key="
    assert render(live) =~ "request_logger_cookie_key="

    Logger.error("hello world", logger_pubsub_backend: {PubSub, RequestLogger.topic("sample")})

    # Guarantees the message above has been processed
    _ = render(live)

    # Guarantees the stream has arrived
    assert render(live) =~ ~s|[error] hello world\n</pre>|
  end

  test "redirects to new node" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/request_logger/helloworld")
    send(live.pid, {:node_redirect, "foo@bar"})
    assert_redirect(live, "/dashboard/foo%40bar/request_logger/helloworld")
  end
end
