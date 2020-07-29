defmodule Phoenix.LiveDashboard.MenuComponentTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveViewTest
  alias Phoenix.LiveDashboard.MenuComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  defp render_menu(menu) do
    menu =
      Enum.into(menu, %{
        refresher?: false,
        refresh: 5,
        refresh_options: [{"1s", 1}, {"2s", 2}, {"5s", 5}],
        route: :home,
        node: node(),
        nodes: [node()],
        metrics: nil,
        request_logger: nil,
        dashboard_running?: true,
        info: nil
      })

    render_component(MenuComponent, %{page: menu}, router: Phoenix.LiveDashboardTest.Router)
  end

  describe "refresher" do
    test "is disabled when true" do
      assert render_menu([]) =~ "Updates automatically"
    end

    test "is enabled when true" do
      render = render_menu(refresher?: true)
      assert render =~ "Update every"
      assert render =~ ~s|<option value="5" selected>5s</option>|

      render = render_menu(refresher?: true, refresh: 1)
      assert render =~ ~s|<option value="1" selected>1s</option>|
    end
  end

  describe "menu" do
    test "disables metrics and request logger" do
      render = render_menu([])
      assert render =~ ~r"Metrics <a[^>]+>Enable</a>"
      assert render =~ ~r"Request Logger <a[^>]+>Enable</a>"
    end

    test "enables metrics and request logger" do
      render = render_menu(metrics: {Foo.Bar, :baz}, request_logger: {"key1", "key2"})
      assert render =~ ~r"Metrics</a>"
      assert render =~ ~r"Request Logger</a>"
    end

    test "when home is active" do
      render = render_menu(route: :home)
      assert render =~ ~s|<div class="menu-item active">Home</div>|
    end

    test "when metrics is active" do
      render = render_menu(route: :metrics, metrics: {Foo.Bar, :baz})
      assert render =~ ~s|<div class="menu-item active">Metrics</div>|
    end

    test "when request logger is active" do
      render = render_menu(route: :request_logger, request_logger: {"key1", "key2"})
      assert render =~ ~s|<div class="menu-item active">Request Logger</div>|
    end

    test "when processes is active" do
      render = render_menu(route: :processes)
      assert render =~ ~s|<div class="menu-item active">Processes</div>|
      assert render =~ ~r"<a[^>]+>Home</a>"
    end

    test "when no live dashboard detected" do
      render = render_menu(dashboard_running?: false)
      refute render =~ ~s|<div class="menu-item">Metrics</div>|
      refute render =~ ~s|<div class="menu-item">Request Logger</div>|
    end
  end
end
