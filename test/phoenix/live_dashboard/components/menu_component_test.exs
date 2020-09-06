defmodule Phoenix.LiveDashboard.MenuComponentTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveViewTest
  alias Phoenix.LiveDashboard.{MenuComponent, PageBuilder}
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  defp render_menu(menu \\ [], page \\ []) do
    page =
      struct(
        %PageBuilder{
          node: node(),
          route: :home
        },
        page
      )

    menu =
      struct(
        %MenuComponent{
          nodes: [node()],
          links: [
            {:current, "Current"},
            {:enabled, "Link", "link"},
            {:disabled, "Disabled"},
            {:disabled, "DisabledLink", "https://example.com"}
          ],
          refresh: 5,
          refresh_options: [{"1s", 1}, {"2s", 2}, {"5s", 5}],
          refresher?: false
        },
        menu
      )

    render_component(MenuComponent, [id: :menu, menu: menu, page: page],
      router: Phoenix.LiveDashboardTest.Router
    )
  end

  describe "refresher" do
    test "is disabled when true" do
      assert render_menu() =~ "Updates automatically"
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
    test "creates link elements" do
      render = render_menu()
      assert render =~ ~r"<a[^>]*href=\"/dashboard/nonode%40nohost/link\"[^>]*>Link</a>"
    end

    test "when a link is active" do
      render = render_menu()
      assert render =~ ~s|<div class="menu-item active">Current</div>|
    end

    test "disables elements with enable link" do
      render = render_menu()
      assert render =~ ~r"DisabledLink <a[^>]*href=\"https://example.com\"[^>]*>Enable</a>"
    end

    test "disables elements without enable link" do
      render = render_menu()
      assert render =~ ~r"Disabled[^<]*</div>"
    end

    test "skips" do
      render = render_menu()
      refute render =~ ~r"Skip"
    end
  end
end
