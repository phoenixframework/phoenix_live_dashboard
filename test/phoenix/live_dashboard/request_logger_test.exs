defmodule Phoenix.LiveDashboard.RequestLoggerTest do
  use ExUnit.Case, async: true

  use Plug.Test
  alias Phoenix.LiveDashboard.RequestLogger

  @endpoint Phoenix.LiveDashboardTest.Endpoint

  def conn(url \\ "/") do
    conn(:get, url)
    |> put_private(:phoenix_endpoint, @endpoint)
  end

  defp request_logger(conn, init) do
    RequestLogger.call(conn, RequestLogger.init(init))
  end

  test "raises if no key is given" do
    assert_raise ArgumentError, fn -> RequestLogger.init([]) end
  end

  test "stores request and cookie keys in private" do
    assert request_logger(conn(), cookie_key: "cookie_key", param_key: "param_key").private.phoenix_request_logger == {"param_key", "cookie_key"}
  end

  test "sets logger metadata for matching param" do
    conn("/param_key=#{RequestLogger.sign(@endpoint, "invalid_key", "rstream")}")
    |> request_logger(param_key: "param_key")

    refute Logger.metadata()[:logger_pubsub_backend]

    conn("/?param_key=#{RequestLogger.sign(@endpoint, "param_key", "rstream")}")
    |> request_logger(cookie_key: "cookie_key")

    refute Logger.metadata()[:logger_pubsub_backend]

    conn("/?param_key=#{RequestLogger.sign(@endpoint, "param_key", "rstream")}")
    |> request_logger(param_key: "param_key")

    assert Logger.metadata()[:logger_pubsub_backend] ==
             {Phoenix.LiveDashboardTest.PubSub, "phx_dashboard:request_logger:rstream"}
  end

  test "sets logger metadata for matching cookie" do
    conn()
    |> put_req_cookie("invalid_key", RequestLogger.sign(@endpoint, "invalid_key", "cstream"))
    |> request_logger(cookie_key: "cookie_key")

    refute Logger.metadata()[:logger_pubsub_backend]

    conn()
    |> put_req_cookie("cookie_key", RequestLogger.sign(@endpoint, "cookie_key", "cstream"))
    |> request_logger(param_key: "param_key")

    refute Logger.metadata()[:logger_pubsub_backend]

    conn()
    |> put_req_cookie("cookie_key", RequestLogger.sign(@endpoint, "cookie_key", "cstream"))
    |> request_logger(cookie_key: "cookie_key")

    assert Logger.metadata()[:logger_pubsub_backend] ==
             {Phoenix.LiveDashboardTest.PubSub, "phx_dashboard:request_logger:cstream"}
  end
end
