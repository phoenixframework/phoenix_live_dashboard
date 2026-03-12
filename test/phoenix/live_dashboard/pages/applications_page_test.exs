defmodule Phoenix.LiveDashboard.ApplicationsPageTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "menu_link/2" do
    assert {:ok, "Applications"} = Phoenix.LiveDashboard.ApplicationsPage.menu_link(nil, nil)
  end

  test "shows applications with limit" do
    {:ok, _live, rendered} = live(build_conn(), "/dashboard/applications")
    assert rendered |> :binary.matches("</tr>") |> length() <= 100
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

  test "not started applications have different status in table" do
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc))
    rendered = render(live)

    assert rendered =~ ~s|<tr id="app-stdlib">|
    refute rendered =~ ~s|<tr id="app-ssh"|

    assert :ok = Application.load(:ssh)

    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc))
    rendered = render(live)
    assert rendered =~ ~s|<tr class="text-muted" id="app-ssh"|

    assert :ok = Application.start(:ssh)
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc))
    rendered = render(live)

    assert rendered =~
             ~s|tr phx-click="show_info" phx-value-info="App&lt;ssh&gt;" phx-page-loading="phx-page-loading" id="app-ssh">|

    assert :ok = Application.stop(:ssh)
    assert :ok = Application.unload(:ssh)
  end

  test "shows the application supervision tree" do
    {:ok, live, _} = live(build_conn(), applications_path(50, "", :version, :asc))
    rendered = live |> element("#app-kernel") |> render_click()
    assert rendered =~ ":rex"
    assert rendered =~ ":standard_error"
  end

  test "list view renders when view_mode=list" do
    {:ok, live, _} = live(build_conn(), app_info_path(:kernel, view_mode: "list"))
    rendered = render(live)
    assert rendered =~ "process-list"
    assert rendered =~ ":rex"
    assert rendered =~ ":standard_error"
    assert rendered =~ "supervisor"
  end

  test "list view filter narrows results and highlights matches" do
    {:ok, live, _} = live(build_conn(), app_info_path(:kernel, view_mode: "list"))
    rendered = render(live)
    assert rendered =~ ":rex"
    assert rendered =~ ":standard_error"

    rendered =
      live
      |> element(".app-info-filter")
      |> render_change(%{"filter" => "rex"})

    assert rendered =~ ":rex"
    refute rendered =~ ":standard_error"
    assert rendered =~ "process-list-match"
  end

  test "list view expand all and collapse all" do
    {:ok, live, _} = live(build_conn(), app_info_path(:kernel, view_mode: "list"))
    rendered = render(live)
    # Tree is expanded by default, so we see nested processes
    assert rendered =~ ":rex"

    # Collapse all hides children
    rendered =
      live
      |> element("button", "Collapse all")
      |> render_click()

    refute rendered =~ ":rex"

    # Expand all shows them again
    rendered =
      live
      |> element("button", "Expand all")
      |> render_click()

    assert rendered =~ ":rex"
  end

  defp app_info_path(app, params) do
    query =
      [{"info", "App<#{app}>"} | Enum.map(params, fn {k, v} -> {to_string(k), v} end)]
      |> URI.encode_query()

    "/dashboard/applications?#{query}"
  end

  defp applications_href(limit, search, sort_by, sort_dir) do
    ~s|href="#{Plug.HTML.html_escape_to_iodata(applications_path(limit, search, sort_by, sort_dir))}"|
  end

  defp applications_path(limit, search, sort_by, sort_dir) do
    "/dashboard/applications?" <>
      "limit=#{limit}&search=#{search}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end
end
