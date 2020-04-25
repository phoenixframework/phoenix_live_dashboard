defmodule Phoenix.LiveDashboard.ApplicationsLiveTest do
  use ExUnit.Case, async: false

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
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :name, :desc, :started))
    rendered = render(live)
    assert rendered =~ "ex_unit"
    assert rendered =~ "kernel"
    assert rendered =~ "applications out of 27"
    assert rendered =~ applications_href(50, "", :name, :asc, :started)

    {:ok, live, _} = live(build_conn(), applications_path(50, "unit", :name, :desc, :started))

    rendered = render(live)
    assert rendered =~ "ex_unit"
    refute rendered =~ "kernel"
    assert rendered =~ "applications out of 1"
    assert rendered =~ applications_href(50, "unit", :name, :asc, :started)

    {:ok, live, _} = live(build_conn(), applications_path(50, "kernel", :name, :desc, :started))
    rendered = render(live)
    assert rendered =~ "kernel"
    refute rendered =~ "ex_unit"
    assert rendered =~ "applications out of 1"
    assert rendered =~ applications_href(50, "kernel", :name, :asc, :started)
  end

  test "active tab started or loaded" do
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc, :started))
    rendered = render(live)
    assert rendered =~ tab_link(50, "", :version, :asc, :started, "Started")
    refute rendered =~ tab_link(50, "", :version, :asc, :loaded, "Loaded")

    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc, :loaded))
    rendered = render(live)
    refute rendered =~ tab_link(50, "", :version, :asc, :started, "Started")
    assert rendered =~ tab_link(50, "", :version, :asc, :loaded, "Loaded")
  end

  test "different count in started and loaded tab" do
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc, :started))
    rendered = render(live)
    count_started =  rendered |> :binary.matches("</tr>") |> length()
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc, :loaded))
    rendered = render(live)
    count_loaded =  rendered |> :binary.matches("</tr>") |> length()

    assert count_loaded == count_started

    #Load only dont start
    Application.load(:sasl)
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc, :started))
    rendered = render(live)
    count_started =  rendered |> :binary.matches("</tr>") |> length()
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc, :loaded))
    rendered = render(live)
    count_loaded =  rendered |> :binary.matches("</tr>") |> length()

    assert count_loaded == count_started + 1
    Application.unload(:sasl)
  end

  defp applications_href(limit, search, sort_by, sort_dir, filter) do
    ~s|href="#{Plug.HTML.html_escape_to_iodata(applications_path(limit, search, sort_by, sort_dir, filter))}"|
  end

  defp applications_path(limit, search, sort_by, sort_dir, filter) do
    "/dashboard/nonode%40nohost/applications?" <>
      "filter=#{filter}&limit=#{limit}&search=#{search}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end

  defp tab_link(limit, search, sort_by, sort_dir, filter, link_text) do
    href = applications_href(limit, search, sort_by, sort_dir, filter)
    ~s|<a class="nav-link active" data-phx-link="patch" data-phx-link-state="push" #{href}>#{link_text}</a>|
  end
end
