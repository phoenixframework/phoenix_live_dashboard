defmodule Phoenix.LiveDashboard.PortsLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  alias Phoenix.LiveDashboard.PortsLive
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "shows ports with limit" do
    {:ok, live, rendered} = live(build_conn(), "/dashboard/nonode@nohost/ports")
    assert rendered |> :binary.matches("</tr>") |> length() <= 100

    rendered = render_patch(live, "/dashboard/nonode@nohost/ports?limit=2")
    assert rendered |> :binary.matches("</tr>") |> length() == 2
  end

end

