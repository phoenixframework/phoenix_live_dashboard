defmodule Phoenix.LiveDashboard.PortsLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "shows processes with limit" do
    {:ok, live, rendered} = live(build_conn(), "/dashboard/nonode@nohost/ports")
    assert rendered |> :binary.matches("</tr>") |> length() <= 100

    rendered = render_patch(live, "/dashboard/nonode@nohost/ports?limit=1000")
    assert rendered |> :binary.matches("</tr>") |> length() > 100
    IO.inspect(rendered)
    assert rendered |> :binary.matches("</tr>") =~ "1"
  end
end

