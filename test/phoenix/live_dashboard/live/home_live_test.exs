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
             ~s|<h6 class="banner-card-title">Dashboard</h6><div class="banner-card-value">| <>
               ~s|#{Application.spec(:phoenix_live_dashboard, :vsn)}</div>|

    assert rendered =~
             ~s|<h6 class=\"banner-card-title\">Uptime</h6><div class=\"banner-card-value\">0m</div>|
  end

  test "redirects to new node" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost")
    send(live.pid, {:node_redirect, "foo@bar"})
    assert_redirect(live, "/dashboard/foo%40bar")
  end

  test "shows memory usage information" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost")
    rendered = render(live)

    assert rendered =~ ~r|<span>Atoms</span><span class="[a-z0-9- ]+">\s+\d+.\d+ \w+\s+</span>|
    assert rendered =~ ~r|<span>Binary</span><span class="[a-z0-9- ]+">\s+\d+.\d+ \w+\s+</span>|
    assert rendered =~ ~r|<span>Code</span><span class="[a-z0-9- ]+">\s+\d+.\d+ \w+\s+</span>|
    assert rendered =~ ~r|<span>ETS</span><span class="[a-z0-9- ]+">\s+\d+.\d+ \w+\s+</span>|

    assert rendered =~
             ~r|<span>Processes</span><span class="[a-z0-9- ]+">\s+\d+.\d+ \w+\s+</span>|

    assert rendered =~ ~r|<span>Other</span><span class="[a-z0-9- ]+">\s+\d+.\d+ \w+\s+</span>|

    assert rendered =~ ~r|Total usage: \d+.\d+|
  end
end
