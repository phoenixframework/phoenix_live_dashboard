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
             ~r{<h6 class="banner-card-title">[\r\n\s]*Dashboard[\r\n\s]*</h6><div class="banner-card-value">[\r\n\s]*#{Application.spec(:phoenix_live_dashboard, :vsn)}[\r\n\s]*</div>}

    assert rendered =~
             ~r{<h6 class=\"banner-card-title\">[\r\n\s]*Uptime[\r\n\s]*</h6><div class=\"banner-card-value\">[\r\n\s]*0m[\r\n\s]*</div>}
  end

  test "shows custom home app" do
    {:ok, live, _} = live(build_conn(), "/config/home")
    rendered = render(live)

    assert rendered =~
             ~r{<h6 class="banner-card-title">[\r\n\s]*Erlang\&\#39;s stdlib[\r\n\s]*</h6><div class="banner-card-value">[\r\n\s]*#{Application.spec(:stdlib, :vsn)}[\r\n\s]*</div>}
  end

  test "shows memory usage information" do
    {:ok, live, _} = live(build_conn(), "/dashboard/home")
    rendered = render(live)

    assert rendered =~ ~r|<span>[\r\n\s]*Atoms[\r\n\s]*</span>|
    assert rendered =~ ~r|<span>[\r\n\s]*Binary[\r\n\s]*</span>|
    assert rendered =~ ~r|<span>[\r\n\s]*Code[\r\n\s]*</span>|
    assert rendered =~ ~r|<span>[\r\n\s]*ETS[\r\n\s]*</span>|
    assert rendered =~ ~r|<span>[\r\n\s]*Processes[\r\n\s]*</span>|
    assert rendered =~ ~r|<span>[\r\n\s]*Other[\r\n\s]*</span>|
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
