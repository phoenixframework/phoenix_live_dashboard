defmodule Phoenix.LiveDashboard.ApplicationsLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "shows applications with limit" do
    {:ok, _live, rendered} = live(build_conn(), "/dashboard/nonode@nohost/applications")
    assert rendered |> :binary.matches("</tr>") |> length() <= 100

    #rendered = render_patch(live, "/dashboard/nonode@nohost/applications?limit=5")
    #assert rendered |> :binary.matches("</tr>") |> length() ==  4
  end

  test "search" do
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :name, :desc))
    rendered = render(live)
    assert rendered =~ "ex_unit"
    assert rendered =~ "kernel"
    refute rendered =~ "applications out of 1"
    assert rendered =~ applications_href(50, "", :name, :asc)

    {:ok, live, _} = live(build_conn(), applications_path(50, "unit", :name, :desc))

    rendered = render(live)
    assert rendered =~ "ex_unit"
    refute rendered =~ "kernel"
    assert rendered =~ "applications out of 1"
    assert rendered =~ applications_href(50, "unit", :name, :asc)

    {:ok, live, _} = live(build_conn(), applications_path(50, "kernel", :name, :desc))
    rendered = render(live)
    assert rendered =~ "kernel"
    refute rendered =~ "ex_unit"
    assert rendered =~ "applications out of 1"
    assert rendered =~ applications_href(50, "kernel", :name, :asc)
  end

  test "12" do
    #Load only dont start
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc))
    rendered = render(live)

    refute rendered =~ ~s|<td>sasl|

    Application.load(:sasl)
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc))
    rendered = render(live)
    assert rendered =~ ~s|<tr class="text-muted"><td>sasl|
    refute rendered =~ ~s|<tr class=""><td>sasl|

    Application.start(:sasl)
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc))
    rendered = render(live)
    refute rendered =~ ~s|<tr class="text-muted"><td>sasl|
    assert rendered =~ ~s|<tr class=""><td>sasl|
    Application.unload(:sasl)
  end

  defp applications_href(limit, search, sort_by, sort_dir) do
    ~s|href="#{Plug.HTML.html_escape_to_iodata(applications_path(limit, search, sort_by, sort_dir))}"|
  end

  defp applications_path(limit, search, sort_by, sort_dir) do
    "/dashboard/nonode%40nohost/applications?" <>
      "limit=#{limit}&search=#{search}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end
end
