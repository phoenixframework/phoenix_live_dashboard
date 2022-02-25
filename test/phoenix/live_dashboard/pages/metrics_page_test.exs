defmodule Phoenix.LiveDashboard.MetricsPageTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "menu_link/2" do
    assert :skip = Phoenix.LiveDashboard.MetricsPage.menu_link(%{}, %{dashboard_running?: false})

    link = "https://hexdocs.pm/phoenix_live_dashboard/metrics.html"

    assert {:disabled, "Metrics", ^link} =
             Phoenix.LiveDashboard.MetricsPage.menu_link(
               %{metrics: nil},
               %{dashboard: true}
             )

    assert {:ok, "Metrics"} =
             Phoenix.LiveDashboard.MetricsPage.menu_link(
               %{metrics: {Module, :fun}},
               %{dashboard: true}
             )
  end

  test "redirects to the first metrics group if no metric group is provided" do
    {:error, {:live_redirect, %{to: "/dashboard/metrics?nav=ecto"}}} =
      live(build_conn(), "/dashboard/metrics")
  end

  test "redirects to the first metrics group if no metric group is provided keeping node" do
    {:error, {:live_redirect, %{to: "/dashboard/nonode%40nohost/metrics?nav=ecto"}}} =
      live(build_conn(), "/dashboard/nonode@nohost/metrics")
  end

  test "shows given group metrics" do
    {:ok, live, _} = live(build_conn(), "/dashboard/metrics?nav=phx")
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
    {:error, {:live_redirect, %{to: "/dashboard/metrics?nav=ecto"}}} =
      live(build_conn(), "/dashboard/metrics?nav=unknown")
  end

  test "redirects on unknown group keeping node" do
    {:error, {:live_redirect, %{to: "/dashboard/nonode%40nohost/metrics?nav=ecto"}}} =
      live(build_conn(), "/dashboard/nonode@nohost/metrics?nav=unknown")
  end

  test "renders history for metrics" do
    data = ~s|<span data-x="#{TestHistory.label()}" data-y="#{TestHistory.measurement()}"|

    {:ok, live, _} = live(build_conn(), "/dashboard/metrics?nav=phx")
    refute render(live) =~ data

    {:ok, live, _} = live(build_conn(), "/config/nonode@nohost/metrics?nav=phx")
    assert render(live) =~ data
  end
end
