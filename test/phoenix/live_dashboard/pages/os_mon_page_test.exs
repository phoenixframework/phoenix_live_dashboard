defmodule Phoenix.LiveDashboard.OSMonPageTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "menu_link/2" do
    capabilities = %{applications: []}

    assert {:disabled, "OS Data", "https://hexdocs.pm/phoenix_live_dashboard/os_mon.html"} =
             Phoenix.LiveDashboard.OSMonPage.menu_link(%{}, capabilities)

    capabilities = %{applications: [:os_mon]}
    assert {:ok, "OS Data"} = Phoenix.LiveDashboard.OSMonPage.menu_link(%{}, capabilities)
  end

  describe "OS mon page" do
    test "displays section titles" do
      {:ok, _live, rendered} = live(build_conn(), "/dashboard/os_mon")
      assert rendered =~ "CPU"
      assert rendered =~ "Memory"
      assert rendered =~ "Disk"
    end
  end
end
