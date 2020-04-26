defmodule Phoenix.LiveDashboard.PortsLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "shows ports with limit" do
    {:ok, live, rendered} = live(build_conn(), "/dashboard/nonode@nohost/ports")
    assert rendered |> :binary.matches("</tr>") |> length() <= 100

    rendered = render_patch(live, "/dashboard/nonode@nohost/ports?limit=2")
    assert rendered |> :binary.matches("</tr>") |> length() == 7
  end

  test "search" do
    Port.open({:spawn, "sleep 15"}, [:binary])
    Port.open({:spawn, "cat"}, [:binary])

    {:ok, live, _} = live(build_conn(), ports_path(50, "", :input, :desc))
    rendered = render(live)
    assert rendered =~ "cat"
    assert rendered =~ "sleep"
    assert rendered =~ "ports out of 8"
    assert rendered =~ ports_href(50, "", :input, :asc)

    {:ok, live, _} = live(build_conn(), ports_path(50, "sleep", :input, :desc))

    rendered = render(live)
    assert rendered =~ "sleep"
    refute rendered =~ "cat"
    assert rendered =~ "ports out of 1"
    assert rendered =~ ports_href(50, "sleep", :input, :asc)

    {:ok, live, _} = live(build_conn(), ports_path(50, "cat", :input, :desc))
    rendered = render(live)
    assert rendered =~ "cat"
    refute rendered =~ "sleep"
    assert rendered =~ "ports out of 1"
    assert rendered =~ ports_href(50, "cat", :input, :asc)
  end

  test "order ports by output" do
    # We got already forker running as #Port<0.0>
    # And we need something thats on all systems and stays attached to the port
    cat = Port.open({:spawn, "cat"}, [:binary])
    send(cat, {self(), {:command, "increase output"}})

    {:ok, live, _} = live(build_conn(), ports_path(50, "", :output, :asc))
    rendered = render(live)
    assert rendered =~ ~r/forker.*cat/s
    assert rendered =~ ports_href(50, "", :output, :desc)
    refute rendered =~ ports_href(50, "", :output, :asc)

    rendered =
      render_patch(live, "/dashboard/nonode@nohost/ports?limit=50&sort_dir=desc&sort_by=output")

    assert rendered =~ ~r/cat.*forker/s
    refute rendered =~ ~r/forker.*cat/s
    assert rendered =~ ports_href(50, "", :output, :asc)
    refute rendered =~ ports_href(50, "", :output, :desc)

    rendered =
      render_patch(live, "/dashboard/nonode@nohost/ports?limit=50&sort_dir=asc&sort_by=output")

    assert rendered =~ ~r/forker.*cat/s
    refute rendered =~ ~r/cat.*forker/s
    assert rendered =~ ports_href(50, "", :output, :desc)
    refute rendered =~ ports_href(50, "", :output, :asc)
  end

  test "shows port info modal" do
    {:ok, live, _} = live(build_conn(), port_info_path(hd(Port.list()), 50, :output, :asc))
    rendered = render(live)
    assert rendered =~ ports_href(50, "", :output, :asc)

    assert rendered =~ "modal-content"
    assert rendered =~ ~r/Port Name.*forker/

    refute live |> element("#modal .close") |> render_click() =~ "modal"
    return_path = ports_path(50, "", :output, :asc)
    assert_patch(live, return_path)
  end

  defp ports_href(limit, search, sort_by, sort_dir) do
    ~s|href="#{Plug.HTML.html_escape_to_iodata(ports_path(limit, search, sort_by, sort_dir))}"|
  end

  defp port_info_path(port, limit, sort_by, sort_dir) do
    "/dashboard/nonode%40nohost/ports/#{Phoenix.LiveDashboard.ViewHelpers.encode_port(port)}?" <>
      "limit=#{limit}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end

  defp ports_path(limit, search, sort_by, sort_dir) do
    "/dashboard/nonode%40nohost/ports?" <>
      "limit=#{limit}&search=#{search}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end
end
