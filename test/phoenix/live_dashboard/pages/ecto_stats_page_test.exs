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

    start_mysql_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    assert rendered =~ "Phoenix.LiveDashboardTest.PGRepo"
    assert rendered =~ "Phoenix.LiveDashboardTest.MySQLRepo"

    start_sqlite_repo!()

    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    assert rendered =~ "Phoenix.LiveDashboardTest.PGRepo"
    assert rendered =~ "Phoenix.LiveDashboardTest.MySQLRepo"
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

  test "editable query parameters" do
    start_pg_repo!()

    new = "/custom_ecto/ecto_stats?repo=#{inspect(PGRepo)}"

    {:ok, live, _} = live(build_conn(), new)
    input = live |> element(~s|input[name="parameter_threshold"]|) |> render()
    assert input =~ ~s|value="10"|
    assert input =~ ~s|placeholder="threshold"|

    {:ok, live, _} = live(build_conn(), new <> "&parameter_threshold=20")
    assert live |> element(~s|input[name="parameter_threshold"]|) |> render() =~ ~s|value="20"|
    assert has_element?(live, "td", "20")

    {:ok, live, _} = live(build_conn(), new <> "&parameter_threshold=abc")
    assert live |> element(~s|input[name="parameter_threshold"]|) |> render() =~ ~s|value="10"|

    {:ok, live, _} = live(build_conn(), new <> "&parameter_threshold=")
    assert live |> element(~s|input[name="parameter_threshold"]|) |> render() =~ ~s|value="10"|

    {:ok, live, _} = live(build_conn(), new <> "&parameter_bogus=5")
    assert live |> element(~s|input[name="parameter_threshold"]|) |> render() =~ ~s|value="10"|
  end

  test "renders a labeled, type-appropriate control for each parameter" do
    start_pg_repo!()
    start_sqlite_repo!()

    {:ok, live, _} = live(build_conn(), "/custom_ecto/ecto_stats?repo=#{inspect(PGRepo)}")

    assert has_element?(live, "details summary", "Parameters")
    refute has_element?(live, "details[open]")
    assert has_element?(live, ~s|details .card form[phx-submit="update_ecto_params"]|)

    assert has_element?(live, ~s|label[for="parameter_threshold"]|, "Threshold")
    assert has_element?(live, ~s|input[name="parameter_threshold"][type="number"]|)

    assert has_element?(
             live,
             ~s|label[for="parameter_threshold"] .small.text-muted.font-italic|,
             "- Minimum number of calls"
           )

    assert has_element?(live, ~s|label[for="parameter_enabled"]|, "Enabled")
    assert has_element?(live, ~s|select[name="parameter_enabled"] option[value="true"]|, "true")
    assert has_element?(live, ~s|select[name="parameter_enabled"] option[value="false"]|, "false")

    assert has_element?(
             live,
             ~s|label[for="parameter_enabled"] .small.text-muted.font-italic|,
             "- Whether the check is enabled"
           )

    assert has_element?(live, ~s|input[name="parameter_threshold"].w-auto|)
    assert has_element?(live, ~s|select[name="parameter_enabled"].w-auto|)

    assert has_element?(live, ~s|form.tabular-parameters input[name="parameter_threshold"]|)

    html = render(live)
    assert {title_at, _} = :binary.match(html, "card-title")
    assert {params_at, _} = :binary.match(html, "toggle_parameter_form")
    assert {table_at, _} = :binary.match(html, "dash-table")
    assert title_at < params_at and params_at < table_at

    {:ok, live, _} = live(build_conn(), "/custom_ecto/ecto_stats?repo=#{inspect(SQLiteRepo)}")
    assert has_element?(live, ~s|input[name="parameter_input"][type="text"]|)
  end

  test "boolean parameters are cast to booleans before reaching the query" do
    start_pg_repo!()
    base = "/custom_ecto/ecto_stats?repo=#{inspect(PGRepo)}"

    {:ok, live, _} = live(build_conn(), base)
    assert has_element?(live, "td", "true")

    {:ok, live, _} = live(build_conn(), base <> "&parameter_enabled=false")
    assert has_element?(live, "td", "false")
  end

  test "the parameters section reads its open state from the URL so a refresh keeps it open" do
    start_pg_repo!()
    base = "/custom_ecto/ecto_stats?repo=#{inspect(PGRepo)}"

    {:ok, live, _} = live(build_conn(), base)
    refute has_element?(live, "details[open]")
    assert has_element?(live, ~s|summary[phx-click="toggle_parameter_form"]|, "Parameters")

    {:ok, live, _} = live(build_conn(), base <> "&params_open=true")
    assert has_element?(live, "details[open]")
  end

  test "the parameters form only shows for queries that declare parameters" do
    start_main_repo!()
    start_pg_repo!()

    base = "/custom_ecto/ecto_stats"

    {:ok, live, _} = live(build_conn(), base <> "?repo=#{inspect(Repo)}&parameter_threshold=999")
    assert render(live) =~ "Fake old query"
    refute has_element?(live, ~s|form[phx-submit="update_ecto_params"]|)

    {:ok, live, _} = live(build_conn(), base <> "?repo=#{inspect(PGRepo)}")
    assert render(live) =~ "Fake new query"
    assert has_element?(live, ~s|input[name="parameter_threshold"]|)
  end

  test "a query that raises renders an error banner instead of crashing" do
    start_sqlite_repo!()

    {:ok, live, _} = live(build_conn(), "/custom_ecto/ecto_stats?repo=#{inspect(SQLiteRepo)}")

    assert has_element?(live, ".alert-danger", "boom: the query could not run")

    assert has_element?(live, "table.dash-table")
    assert has_element?(live, ~s|input[name="parameter_input"]|)
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

  defp start_mysql_repo! do
    start_supervised!(MySQLRepo)
  end

  defp start_sqlite_repo! do
    start_supervised!(SQLiteRepo)
  end

  defp start_custom_repo! do
    start_supervised!(CustomRepo)
  end
end
