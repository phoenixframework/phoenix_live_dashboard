defmodule Phoenix.LiveDashboard.MetricsLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "shows metrics groups" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/metrics")
    rendered = render(live)
    assert rendered =~ "Updates automatically"
    assert rendered =~ "&quot;phx&quot; metrics"
    assert rendered =~ "&quot;ecto&quot; metrics"
  end

  test "shows given group metrics" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/metrics/phx")
    rendered = render(live)
    assert rendered =~ "Updates automatically"
    assert rendered =~ "&quot;phx&quot; metrics"
    assert rendered =~ "&quot;ecto&quot; metrics"
    assert rendered =~ ~s|data-title="phx.b.c"|
    assert rendered =~ ~s|data-title="phx.b.d"|

    send(live.pid, {:telemetry, [{0, nil, "value", System.system_time(:millisecond)}]})

    # Guarantees the message above has been processed
    _ = render(live)

    # Guarantees the components have been updated
    assert render(live) =~ ~s|<span data-x="phx.b.c" data-y="value"|
  end

  test "redirects on unknown group" do
    {:error, %{redirect: %{to: "/dashboard/nonode%40nohost/metrics"}}} =
      live(build_conn(), "/dashboard/nonode@nohost/metrics/unknown")
  end

  test "redirects to new node" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/metrics")
    send(live.pid, {:node_redirect, "foo@bar"})
    assert_redirect(live, "/dashboard/foo%40bar/metrics")

    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/metrics/phx")
    send(live.pid, {:node_redirect, "foo@bar"})
    assert_redirect(live, "/dashboard/foo%40bar/metrics/phx")
  end
end
