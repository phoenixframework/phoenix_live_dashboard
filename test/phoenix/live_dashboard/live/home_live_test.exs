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
    assert rendered =~ "Dashboard version: #{Application.spec(:phoenix_live_dashboard, :vsn)}"
    assert rendered =~ ~r"Atoms: \d+ / \d+ \(\d+% used\)"
    assert rendered =~ ~r"Ports: \d+ / \d+ \(\d+% used\)"
    assert rendered =~ ~r"Processes: \d+ / \d+ \(\d+% used\)"
  end

  test "redirects to new node" do
    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost")
    send(live.pid, {:node_redirect, "foo@bar"})
    assert_redirect live, "/dashboard/foo%40bar"
  end
end
