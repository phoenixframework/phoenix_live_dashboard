defmodule Phoenix.LiveDashboard.MetricsLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "redirects to the first metrics group if no metric group is provided" do
    {:error, {:live_redirect, %{to: "/dashboard/nonode%40nohost/metrics?group=ecto"}}} =
      live(build_conn(), "/dashboard/nonode@nohost/metrics")
  end

  test "shows given group metrics" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/metrics?group=phx")
    rendered = render(live)
    assert rendered =~ "Updates automatically"
    assert rendered =~ "Phx"
    assert rendered =~ "Ecto"
    assert rendered =~ "MyApp"
    assert rendered =~ ~s|data-title="phx.b.c"|
    assert rendered =~ ~s|data-title="phx.b.d"|

    send(live.pid, {:telemetry, [{0, nil, "value", System.system_time(:millisecond)}]})

    # Guarantees the message above has been processed
    _ = render(live)

    # Guarantees the components have been updated
    assert render(live) =~ ~s|<span data-x="C" data-y="value"|
  end

  test "redirects on unknown group" do
    {:error, {:live_redirect, %{to: "/dashboard/nonode%40nohost/metrics"}}} =
      live(build_conn(), "/dashboard/nonode@nohost/metrics?group=unknown")
  end

  test "redirects to new node" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/metrics?group=ecto")
    send(live.pid, {:node_redirect, "foo@bar"})
    assert_redirect(live, "/dashboard/foo%40bar/metrics?group=ecto")

    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/metrics?group=phx")
    send(live.pid, {:node_redirect, "foo@bar"})
    assert_redirect(live, "/dashboard/foo%40bar/metrics?group=phx")
  end
end
