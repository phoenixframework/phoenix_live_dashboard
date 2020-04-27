defmodule Phoenix.LiveDashboard.BarLegendComponentTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.BarLegendComponent
  import Phoenix.LiveViewTest

  @endpoint Phoenix.LiveDashboardTest.Endpoint

  @data [
    {:in_use_memory, "In use", 4.0, "purple"}
  ]

  describe "rendering" do
    test "color bar component" do
      result = render_bar(@data)
      assert result =~ "bg-purple"
      assert result =~ "4.0%"
      assert result =~ "resource-usage-legend-entry-2"
    end
  end

  defp render_bar(data) do
    render_component(BarLegendComponent, id: :id, data: data, options: [height: 2])
  end
end
