defmodule Phoenix.LiveDashboard.EctoStatsPageTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  alias Phoenix.LiveDashboard.EctoStatsPage
  alias Phoenix.LiveDashboardTest.Repo
  alias Phoenix.LiveDashboardTest.PGRepo
  alias Phoenix.LiveDashboardTest.MySQLRepo

  test "menu_link/2" do
    assert :skip = EctoStatsPage.menu_link(%{repos: []}, %{})
    assert :skip = EctoStatsPage.menu_link(%{repos: [Repo]}, %{processes: []})

    assert {:ok, "Ecto Stats"} = EctoStatsPage.menu_link(%{repos: [Repo]}, %{processes: [Repo]})

    assert {:ok, "Ecto Stats"} =
             EctoStatsPage.menu_link(%{repos: :auto_discover}, %{processes: []})
  end

  test "renders" do
    start_main_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    refute rendered =~ "Phoenix.LiveDashboardTest.PGRepo"
    refute rendered =~ "Phoenix.LiveDashboardTest.MySQLRepo"
    assert rendered =~ ~r"Showing \d+ entries"

    start_pg_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    assert rendered =~ "Phoenix.LiveDashboardTest.PGRepo"

    start_mysql_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    assert rendered =~ "Phoenix.LiveDashboardTest.PGRepo"
    assert rendered =~ "Phoenix.LiveDashboardTest.MySQLRepo"
  end

  test "renders error without running repos" do
    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    refute rendered =~ "Phoenix.LiveDashboardTest.Repo"

    assert rendered =~
             "No Ecto repository was found running on this node."

    assert rendered =~ "Currently only PSQL and MySQL databases are supported."

    assert rendered =~
             "Depending on the database Ecto PSQL Extras or Ecto MySQL Extras should be installed."

    assert rendered =~
             ~s|Check the <a href="https://hexdocs.pm/phoenix_live_dashboard/ecto_stats.html" target="_blank">documentation</a> for details|
  end

  @forbidden_navs [:kill_all, :mandelbrot]

  test "navs" do
    start_main_repo!()

    for {nav, _} <- EctoPSQLExtras.queries(Repo), nav not in @forbidden_navs do
      assert {:ok, _, _} = live(build_conn(), ecto_stats_path(nav))
    end

    start_mysql_repo!()

    for {nav, _} <- EctoMySQLExtras.queries(MySQLRepo) do
      assert {:ok, _, _} = live(build_conn(), ecto_stats_path(nav))
    end

    start_pg_repo!()

    available_navs =
      for {nav, _} <- EctoPSQLExtras.queries(PGRepo), nav not in @forbidden_navs, do: nav

    nav = Enum.random(available_navs)

    assert {:ok, live, _} = live(build_conn(), ecto_stats_path(nav, "", PGRepo))

    assert live
           |> element("a.active", "Phoenix.LiveDashboardTest.PGRepo")
           |> has_element?()

    another_nav = Enum.random(available_navs -- [nav])

    live
    |> element(~s|a.nav-link[href*='nav=#{another_nav}']|)
    |> render_click()

    # Keep the same repo selected
    assert live
           |> element("a.active", "Phoenix.LiveDashboardTest.PGRepo")
           |> has_element?()
  end

  test "search" do
    start_main_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path(:extensions))
    rendered = render(live)
    assert rendered =~ "Default version"
    assert rendered =~ "Installed version"
    assert rendered =~ "fuzzystrmatch"
    assert rendered =~ "hstore"

    {:ok, live, _} = live(build_conn(), ecto_stats_path(:extensions, "hstore"))
    rendered = render(live)
    assert rendered =~ "Default version"
    assert rendered =~ "Installed version"
    refute rendered =~ "fuzzystrmatch"
    assert rendered =~ "hstore"

    start_mysql_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path(:plugins, "", MySQLRepo))

    rendered = render(live)
    assert rendered =~ "Version"
    assert rendered =~ "Status"
    assert rendered =~ "PERFORMANCE_SCHEMA"
    assert rendered =~ "InnoDB"

    {:ok, live, _} =
      live(
        build_conn(),
        ecto_stats_path(:plugins, "InnoDB", MySQLRepo)
      )

    rendered = render(live)
    assert rendered =~ "Version"
    assert rendered =~ "Status"
    refute rendered =~ "PERFORMANCE_SCHEMA"
    assert rendered =~ "InnoDB"
  end

  defp ecto_stats_path() do
    "/dashboard/ecto_stats"
  end

  defp ecto_stats_path(nav) do
    "#{ecto_stats_path()}?nav=#{nav}"
  end

  defp ecto_stats_path(nav, search) do
    "#{ecto_stats_path()}?nav=#{nav}&search=#{search}"
  end

  defp ecto_stats_path(nav, search, repo) do
    "#{ecto_stats_path()}?nav=#{nav}&search=#{search}&repo=#{repo}"
  end

  defp start_main_repo! do
    start_supervised!(Repo)
  end

  defp start_pg_repo! do
    start_supervised!(PGRepo)
  end

  defp start_mysql_repo! do
    start_supervised!(MySQLRepo)
  end
end
