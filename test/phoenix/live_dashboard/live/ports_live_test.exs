defmodule Phoenix.LiveDashboard.PortsLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "shows ports with limit" do
    {:ok, live, rendered} = live(build_conn(), "/dashboard/nonode@nohost/ports")
    assert rendered |> :binary.matches("</tr>") |> length() <= 100

    rendered = render_patch(live, "/dashboard/nonode@nohost/ports?limit=2")
    assert rendered |> :binary.matches("</tr>") |> length() == 4
  end

  test "search" do
    sleep = Port.open({:spawn, "sleep 15"}, [:binary])
    sh = Port.open({:spawn, "sh"}, [:binary])

    {:ok, live, _} = live(build_conn(), ports_path(50, "", :input, :desc))
    rendered = render(live)
    assert rendered =~ ~r/sh/
    assert rendered =~ ~r/sleep/
    assert rendered =~ "ports out of 5"
    assert rendered =~ ports_href(50, "", :input, :asc)

    {:ok, live, _} = live(build_conn(), ports_path(50, "sleep", :input, :desc))

    rendered = render(live)
    assert rendered =~ ~r/sleep/
    refute rendered =~ ~r/\/bin\/sh/
    assert rendered =~ "ports out of 1"
    assert rendered =~ ports_href(50, "sleep", :input, :asc)

    #pid = pid |> :erlang.pid_to_list() |> List.to_string()
    {:ok, live, _} = live(build_conn(), ports_path(50, "sh", :input, :desc))
    rendered = render(live)
    assert rendered =~ ~r/sh/
    refute rendered =~ ~r/sleep/
    assert rendered =~ "ports out of 1"
    assert rendered =~ ports_href(50, "sh", :input, :asc)

    Port.close(sleep)
    Port.close(sh)
  end

  test "order ports by id" do
    sleep = Port.open({:spawn, "sleep 15"}, [:binary])

    {:ok, live, _} = live(build_conn(), ports_path(50, "", :id, :asc))
    rendered = render(live)
    assert rendered =~ ~r/forker.*sleep/s
    assert rendered =~ ports_href(50, "", :id, :desc)
    refute rendered =~ ports_href(50, "", :id, :asc)

    rendered = render_patch(live, "/dashboard/nonode@nohost/ports?limit=50&sort_dir=desc")
    assert rendered =~ ~r/sleep.*forker/s
    refute rendered =~ ~r/forker.*sleep/s
    assert rendered =~ ports_href(50, "", :id, :asc)
    refute rendered =~ ports_href(50, "", :id, :desc)
    
    rendered = render_patch(live, "/dashboard/nonode@nohost/ports?limit=50&sort_dir=asc")
    assert rendered =~ ~r/forker.*sleep/s
    refute rendered =~ ~r/sleep.*forker/s
    assert rendered =~ ports_href(50, "", :id, :desc)
    refute rendered =~ ports_href(50, "", :id, :asc)
    Port.close(sleep)
  end

  test "order ports by output" do
    sleep = Port.open({:spawn, "sleep 15"}, [:binary])
    send(sleep, {self(), {:command, "increase output"}})

    {:ok, live, _} = live(build_conn(), ports_path(50, "", :output, :asc))
    rendered = render(live)
    assert rendered =~ ~r/forker.*sleep/s
    assert rendered =~ ports_href(50, "", :output, :desc)
    refute rendered =~ ports_href(50, "", :output, :asc)

    rendered = render_patch(live, "/dashboard/nonode@nohost/ports?limit=50&sort_dir=desc")
    assert rendered =~ ~r/sleep.*forker/s
    refute rendered =~ ~r/forker.*sleep/s
    assert rendered =~ ports_href(50, "", :output, :asc)
    refute rendered =~ ports_href(50, "", :output, :desc)
    
    rendered = render_patch(live, "/dashboard/nonode@nohost/ports?limit=50&sort_dir=asc")
    assert rendered =~ ~r/forker.*sleep/s
    refute rendered =~ ~r/sleep.*forker/s
    assert rendered =~ ports_href(50, "", :output, :desc)
    refute rendered =~ ports_href(50, "", :output, :asc)
    Port.close(sleep)
  end

  defp ports_href(limit, search, sort_by, sort_dir) do
    ~s|href="#{Plug.HTML.html_escape_to_iodata(ports_path(limit, search, sort_by, sort_dir))}"|
  end

  defp ports_info_path(port, limit, sort_by, sort_dir) do
    "/dashboard/nonode%40nohost/ports/#{Phoenix.LiveDashboard.ViewHelpers.encode_port(port)}?" <>
      "limit=#{limit}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end

  defp ports_path(limit, search, sort_by, sort_dir) do
    "/dashboard/nonode%40nohost/ports?" <>
      "limit=#{limit}&search=#{search}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end

end

