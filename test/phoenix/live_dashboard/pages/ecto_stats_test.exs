defmodule Phoenix.LiveDashboard.EctoStatsPageTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  alias Phoenix.LiveDashboard.EctoStatsPage
  alias Phoenix.LiveDashboardTest.Repo
  @link "https://hexdocs.pm/phoenix_live_dashboard/ecto_stats.html"

  test "menu_link/2" do
    assert {:disabled, "Ecto Stats", @link} = EctoStatsPage.menu_link(%{repo: nil}, %{})
    assert :skip = EctoStatsPage.menu_link(%{repo: Repo}, %{processes: []})

    assert {:ok, "Phoenix LiveDashboardTest Repo Stats"} =
             EctoStatsPage.menu_link(%{repo: Repo}, %{processes: [Repo]})
  end

  test "renders" do
    {:ok, live, _} = live(build_conn(), ecto_stats_path())
    rendered = render(live)
    assert rendered =~ "All locks"
    assert rendered =~ "Extensions"
    assert rendered =~ "Transactionid"
    assert rendered =~ "Granted"
  end

  @forbidden_navs [:calls, :outliers, :kill_all, :mandelbrot]

  test "navs" do
    for {nav, _} <- EctoPSQLExtras.queries, nav not in @forbidden_navs do
      {:ok, _, _} = live(build_conn(), ecto_stats_path(nav))
    end
  end

  test "search" do
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
  end

  defp ecto_stats_path() do
    "/dashboard/nonode%40nohost/phoenix_live_dashboard_test_repo_info"
  end

  defp ecto_stats_path(nav) do
    "#{ecto_stats_path()}?nav=#{nav}"
  end

  defp ecto_stats_path(nav, search) do
    "#{ecto_stats_path()}?nav=#{nav}&search=#{search}"
  end
end
