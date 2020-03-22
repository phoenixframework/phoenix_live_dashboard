defmodule Phoenix.LiveDashboard.RefresherLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  alias Phoenix.LiveDashboard.RefresherLive
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  defp refresher_live(refresher) do
    refresher =
      Enum.into(refresher, %{
        enabled?: false,
        menu: %{}
      })

    live_isolated(build_conn(), RefresherLive,
      session: %{"refresher" => refresher},
      router: Phoenix.LiveDashboardTest.Router
    )
  end

  describe "refresher" do
    test "is disabled when false" do
      {:ok, live, _} = refresher_live([])
      assert render(live) =~ "Updates automatically"
    end

    test "is enabled when true" do
      {:ok, live, _} = refresher_live(enabled?: true)
      assert render(live) =~ "Update every"
      assert render(live) =~ ~s|<option value="5" selected="selected">5s</option>|

      assert render_change(live, "select_refresh", %{"refresh" => "1"}) =~
               ~s|<option value="1" selected="selected">1s</option>|
    end
  end
end
