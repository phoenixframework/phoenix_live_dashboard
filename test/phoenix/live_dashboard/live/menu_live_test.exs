defmodule Phoenix.LiveDashboard.MenuLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  alias Phoenix.LiveDashboard.MenuLive
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  defp menu_live(menu) do
    menu =
      Enum.into(menu, %{
        refresher?: false,
        action: :home,
        node: node(),
        metrics: nil,
        request_logger: nil
      })

    live_isolated(build_conn(), MenuLive,
      session: %{"menu" => menu},
      router: Phoenix.LiveDashboardTest.Router
    )
  end

  describe "refresher" do
    test "is disabled when true" do
      {:ok, live, _} = menu_live([])
      assert render(live) =~ "Updates automatically"
    end

    test "is enabled when true" do
      {:ok, live, _} = menu_live(refresher?: true)
      assert render(live) =~ "Update every"
      assert render(live) =~ ~s|<option value="5" selected="selected">5s</option>|

      assert render_change(live, "select_refresh", %{"refresh" => "1"}) =~
               ~s|<option value="1" selected="selected">1s</option>|
    end
  end

  describe "menu" do
    test "disables metrics and request logger" do
      {:ok, live, _} = menu_live([])
      assert render(live) =~ ~r"Metrics <a[^>]+>Enable</a>"
      assert render(live) =~ ~r"Request Logger <a[^>]+>Enable</a>"
    end

    test "enables metrics and request logger" do
      {:ok, live, _} = menu_live(metrics: {Foo.Bar, :baz}, request_logger: {"key1", "key2"})
      assert render(live) =~ ~r"Metrics</a>"
      assert render(live) =~ ~r"Request Logger</a>"
    end

    test "when home is active" do
      {:ok, live, _} = menu_live(action: :home)
      assert render(live) =~ ~s|<div class="menu-item active">Home</div>|
    end

    test "when metrics is active" do
      {:ok, live, _} = menu_live(action: :metrics, metrics: {Foo.Bar, :baz})
      assert render(live) =~ ~s|<div class="menu-item active">Metrics</div>|
    end

    test "when request logger is active" do
      {:ok, live, _} = menu_live(action: :request_logger, request_logger: {"key1", "key2"})
      assert render(live) =~ ~s|<div class="menu-item active">Request Logger</div>|
    end
  end
end
