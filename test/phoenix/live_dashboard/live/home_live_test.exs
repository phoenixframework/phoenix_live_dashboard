defmodule Phoenix.LiveDashboard.HomeLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "redirects when host is missing" do
    conn = get(build_conn(), "/dashboard")
    assert redirected_to(conn) == "/dashboard/nonode%40nohost"
  end

  test "shows system information" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost")
    rendered = render(live)
    assert rendered =~ "Update every"
    assert rendered =~ to_string(:erlang.system_info(:system_version))

    assert rendered =~
             ~s|<h6 class="banner-card-title">Dashboard</h6><div class="banner-card-value">#{
               Application.spec(:phoenix_live_dashboard, :vsn)
             }</div></div>|

    # ~s|"#{Application.spec(:phoenix_live_dashboard, :vsn)}|
    assert rendered =~
             ~r"Atoms\s+</div><div><small class=\"text-muted pr-2\">\s+\d+ / \d+\s+</small><strong>\s+\d+%"

    assert rendered =~
             ~r"Ports\s+</div><div><small class=\"text-muted pr-2\">\s+\d+ / \d+\s+</small><strong>\s+\d+%"

    assert rendered =~
             ~r"Processes\s+</div><div><small class=\"text-muted pr-2\">\s+\d+ / \d+\s+</small><strong>\s+\d+%"
  end

  test "redirects to new node" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost")
    send(live.pid, {:node_redirect, "foo@bar"})
    assert_redirect(live, "/dashboard/foo%40bar")
  end
end
