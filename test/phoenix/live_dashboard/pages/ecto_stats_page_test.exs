defmodule Phoenix.LiveDashboard.EctoStatsPageTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  alias Phoenix.LiveDashboard.EctoStatsPage
  alias Phoenix.LiveDashboardTest.Repo
  alias Phoenix.LiveDashboardTest.PGRepo
  alias Phoenix.LiveDashboardTest.MySQLRepo
  alias Phoenix.LiveDashboardTest.SQLiteRepo
  alias Phoenix.LiveDashboardTest.CustomRepo

  test "menu_link/2" do
    assert :skip = EctoStatsPage.menu_link(%{repos: []}, %{})
    assert :skip = EctoStatsPage.menu_link(%{repos: [Repo]}, %{processes: []})

    assert {:ok, "Ecto Stats"} = EctoStatsPage.menu_link(%{repos: [Repo]}, %{processes: [Repo]})

    assert {:ok, "Ecto Stats"} =
             EctoStatsPage.menu_link(%{repos: :auto_discover}, %{processes: []})

    # A repo configured with an explicit info module, i.e. `{repo, info_module}`
    assert :skip =
             EctoStatsPage.menu_link(%{repos: [{CustomRepo, EctoPSQLExtras}]}, %{processes: []})

    assert {:ok, "Ecto Stats"} =
             EctoStatsPage.menu_link(
               %{repos: [{CustomRepo, EctoPSQLExtras}]},
               %{processes: [CustomRepo]}
             )

    # The configured info module is not available
    assert {:disabled, "Ecto Stats", _} =
             EctoStatsPage.menu_link(%{repos: [{CustomRepo, nil}]}, %{processes: [CustomRepo]})
  end

  test "init/1 builds process capabilities for repos with a custom info module" do
    assert {:ok, session, capabilities} =
             EctoStatsPage.init(%{
               repos: [Repo, {CustomRepo, EctoPSQLExtras}],
               ecto_psql_extras_options: [],
               ecto_mysql_extras_options: [],
               ecto_sqlite3_extras_options: []
             })

    assert session.repos == [Repo, {CustomRepo, EctoPSQLExtras}]
    assert capabilities == [process: Repo, process: CustomRepo]
  end

  test "renders" do
    start_main_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    refute rendered =~ "Phoenix.LiveDashboardTest.PGRepo"
    refute rendered =~ "Phoenix.LiveDashboardTest.MySQLRepo"
    refute rendered =~ "Phoenix.LiveDashboardTest.SQLiteRepo"
    refute rendered =~ "Phoenix.LiveDashboardTest.CustomRepo"
    assert rendered =~ ~r"Showing \d+ entries"

    start_pg_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    assert rendered =~ "Phoenix.LiveDashboardTest.PGRepo"

    mysql_started? = start_mysql_repo()

    if mysql_started? do
      {:ok, live, _} = live(build_conn(), ecto_stats_path())
      rendered = render(live)

      assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
      assert rendered =~ "Phoenix.LiveDashboardTest.PGRepo"
      assert rendered =~ "Phoenix.LiveDashboardTest.MySQLRepo"
    end

    start_sqlite_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    assert rendered =~ "Phoenix.LiveDashboardTest.PGRepo"
    if mysql_started?, do: assert(rendered =~ "Phoenix.LiveDashboardTest.MySQLRepo")
    assert rendered =~ "Phoenix.LiveDashboardTest.SQLiteRepo"

    start_custom_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    assert rendered =~ "Phoenix.LiveDashboardTest.PGRepo"
    assert rendered =~ "Phoenix.LiveDashboardTest.MySQLRepo"
    assert rendered =~ "Phoenix.LiveDashboardTest.SQLiteRepo"
    assert rendered =~ "Phoenix.LiveDashboardTest.CustomRepo"
  end

  test "renders error without running repos" do
    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    refute rendered =~ "Phoenix.LiveDashboardTest.Repo"

    assert rendered =~
             "No Ecto repository was found running on this node."

    assert rendered =~ "Currently, only PostgreSQL, MySQL, and SQLite databases are supported."

    assert rendered =~
             "Depending on the database, ecto_psql_extras, ecto_mysql_extras, or ecto_sqlite3_extras should be installed."

    assert rendered =~
             ~r|<a href="https://hexdocs.pm/phoenix_live_dashboard/ecto_stats.html" target="_blank">\s*documentation\s*</a>|
  end

  @forbidden_navs [:kill_all, :mandelbrot]

  test "navs" do
    start_main_repo!()

    for {nav, _} <- EctoPSQLExtras.queries(Repo), nav not in @forbidden_navs do
      assert {:ok, _, _} = live(build_conn(), ecto_stats_path(nav))
    end

    if start_mysql_repo() do
      for {nav, _} <- EctoMySQLExtras.queries(MySQLRepo) do
        assert {:ok, _, _} = live(build_conn(), ecto_stats_path(nav))
      end
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

    if start_mysql_repo() do
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

    start_sqlite_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path(:plugins, "", SQLiteRepo))

    rendered = render(live)
    assert rendered =~ "page_size"
    assert rendered =~ "unused_size"
    assert rendered =~ "pages"
    assert rendered =~ "cells"

    {:ok, live, _} =
      live(
        build_conn(),
        ecto_stats_path(:plugins, "page_size", SQLiteRepo)
      )

    rendered = render(live)
    assert rendered =~ "page_size"
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
    "#{ecto_stats_path()}?nav=#{nav}&search=#{search}&repo=#{inspect(repo)}"
  end

  defp start_main_repo! do
    start_supervised!(Repo)
  end

  defp start_pg_repo! do
    start_supervised!(PGRepo)
  end

  defp start_mysql_repo do
    with mysql_url when is_binary(mysql_url) <- System.get_env("MYSQL_URL"),
         {:ok, _} <- start_supervised(MySQLRepo),
         {:ok, _} <- mysql_query() do
      true
    else
      _ ->
        stop_supervised(MySQLRepo)
        false
    end
  end

  defp mysql_query do
    try do
      MySQLRepo.query("SELECT 1", [], timeout: 500, pool_timeout: 500)
    catch
      :exit, reason -> {:error, reason}
    end
  end

  defp start_sqlite_repo! do
    start_supervised!(SQLiteRepo)
  end

  defp start_custom_repo! do
    start_supervised!(CustomRepo)
  end
end
