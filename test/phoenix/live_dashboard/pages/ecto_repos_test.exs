defmodule Phoenix.LiveDashboard.EctoReposPageTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  alias Phoenix.LiveDashboard.EctoReposPage
  alias Phoenix.LiveDashboardTest.Repo
  alias Phoenix.LiveDashboardTest.PGRepo
  alias Phoenix.LiveDashboardTest.MySQLRepo

  test "menu_link/2" do
    assert :skip = EctoReposPage.menu_link(%{repos: []}, %{})
    assert :skip = EctoReposPage.menu_link(%{repos: [Repo]}, %{processes: []})

    assert {:disabled, "Ecto Repos"} =
             EctoReposPage.menu_link(%{repos: [Repo]}, %{processes: [Repo]})

    assert {:ok, "Ecto Repos"} =
             EctoReposPage.menu_link(%{repos: :auto_discover}, %{processes: []})
  end

  test "renders" do
    start_main_repo!()

    {:ok, live, _} = live(build_conn(), ecto_repos_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    refute rendered =~ "Phoenix.LiveDashboardTest.PGRepo"
    refute rendered =~ "Phoenix.LiveDashboardTest.MySQLRepo"
    assert rendered =~ ~r"Showing \d+ entries"

    start_pg_repo!()

    {:ok, live, _} = live(build_conn(), ecto_repos_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    assert rendered =~ "Phoenix.LiveDashboardTest.PGRepo"

    start_mysql_repo!()

    {:ok, live, _} = live(build_conn(), ecto_repos_path())
    rendered = render(live)

    assert rendered =~ "Phoenix.LiveDashboardTest.Repo"
    assert rendered =~ "Phoenix.LiveDashboardTest.PGRepo"
    assert rendered =~ "Phoenix.LiveDashboardTest.MySQLRepo"
  end

  test "renders error without running repos" do
    {:ok, live, _} = live(build_conn(), ecto_repos_path())
    rendered = render(live)

    refute rendered =~ "Phoenix.LiveDashboardTest.Repo"

    assert rendered =~
             "No Ecto repository was found running on this node."

    assert rendered =~ "Currently only Postgres and MySQL databases are supported."
  end

  test "navs" do
    start_main_repo!()

    assert {:ok, _, _} = live(build_conn(), ecto_repos_path(nav: "migrations"))

    start_mysql_repo!()

    assert {:ok, _, _} =
             live(
               build_conn(),
               ecto_repos_path(nav: "migrations", repo: Phoenix.LiveDashboardTest.MySQLRepo)
             )

    start_pg_repo!()

    assert {:ok, _, _} =
             live(
               build_conn(),
               ecto_repos_path(nav: "migrations", repo: Phoenix.LiveDashboardTest.PGRepo)
             )
  end

  defp ecto_repos_path(query \\ []) do
    base = "/dashboard/ecto_repos"

    case URI.encode_query(query) do
      "" ->
        base

      query ->
        base <> "?" <> query
    end
  end

  defp start_main_repo! do
    start_supervised(Repo)
  end

  defp start_pg_repo! do
    start_supervised(PGRepo)
  end

  defp start_mysql_repo! do
    start_supervised(MySQLRepo)
  end
end
