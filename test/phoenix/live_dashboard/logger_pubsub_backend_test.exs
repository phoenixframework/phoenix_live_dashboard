defmodule Phoenix.LiveDashboard.LoggerPubSubBackendTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboardTest.PubSub
  require Logger

  @tag :capture_log
  test "broadcasts messages when metadata matches" do
    Phoenix.PubSub.subscribe(PubSub, "hello:world")
    Logger.error("refute_received")
    Logger.error("assert_received", logger_pubsub_backend: {PubSub, "hello:world"})
    assert_receive {:logger, :error, msg}, 1000
    assert IO.iodata_to_binary(msg) == "[error] assert_received\n"
    refute_received {:logger, _, _}
  end
end
