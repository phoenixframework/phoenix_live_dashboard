defmodule Phoenix.LiveDashboard.HomePageTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "menu_link/2" do
    assert {:ok, "Home"} = Phoenix.LiveDashboard.HomePage.menu_link(nil, nil)
  end

  test "redirects when page is missing" do
    conn = get(build_conn(), "/dashboard")
    assert redirected_to(conn) == "/dashboard/home"
  end

  test "redirects when node is wrong" do
    conn = get(build_conn(), "/dashboard/wrong@node/home")
    assert redirected_to(conn) == "/dashboard/home"
  end

  test "supports requests with node" do
    conn = get(build_conn(), "/dashboard/nonode@nohost/home")
    assert html_response(conn, 200) =~ "/dashboard/nonode%40nohost/applications"
  end

  test "shows system information" do
    {:ok, live, _} = live(build_conn(), "/dashboard/home")
    rendered = render(live)
    assert rendered =~ "Update every"
    assert rendered =~ to_string(:erlang.system_info(:system_version))

    assert rendered =~
             ~s|<h6 class="banner-card-title">\n      Dashboard\n      \n    </h6><div class="banner-card-value">| <>
               ~s|#{Application.spec(:phoenix_live_dashboard, :vsn)}</div>|

    assert rendered =~
             ~s|<h6 class=\"banner-card-title\">\n      Uptime\n      \n    </h6><div class=\"banner-card-value\">0m</div>|
  end

  test "shows custom home app" do
    {:ok, live, _} = live(build_conn(), "/config/home")
    rendered = render(live)

    assert rendered =~
             ~s|<h6 class="banner-card-title">\n      Erlang&apos;s stdlib\n      \n    </h6><div class="banner-card-value">| <>
               ~s|#{Application.spec(:stdlib, :vsn)}</div>|
  end

  test "shows memory usage information" do
    {:ok, live, _} = live(build_conn(), "/dashboard/home")
    rendered = render(live)

    assert rendered =~ ~r|<span>Atoms </span>|
    assert rendered =~ ~r|<span>Binary </span>|
    assert rendered =~ ~r|<span>Code </span>|
    assert rendered =~ ~r|<span>ETS </span>|
    assert rendered =~ ~r|<span>Processes </span>|
    assert rendered =~ ~r|<span>Other </span>|
    assert rendered =~ ~r|Total usage: \d+.\d+|
  end

  test "is the current page in menu component" do
    {:ok, _live, rendered} = live(build_conn(), "/dashboard/home")
    assert rendered =~ ~s|<div class="menu-item active">Home</div>|
  end

  test "shows env keys" do
    {:ok, live, _} = live(build_conn(), "/config/nonode@nohost/home")
    rendered = render(live)
    assert rendered =~ "PHX_DASHBOARD_TEST"
    assert rendered =~ "PHX_DASHBOARD_ENV_VALUE"
  end
end
