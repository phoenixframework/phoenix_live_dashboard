defmodule Phoenix.LiveDashboard.ColorBarLegendComponentTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.ColorBarLegendComponent
  import Phoenix.LiveViewTest

  @endpoint Phoenix.LiveDashboardTest.Endpoint

  @data [
    {:in_use_memory, "In use", 4.0, "purple"}
  ]

  describe "rendering" do
    test "color bar component" do
      result = render_component(ColorBarLegendComponent, id: :id, data: @data)
      assert result =~ "bg-purple"
      assert result =~ "4.0%"
      assert result =~ "resource-usage-legend-entry-3"
    end

    test "color bar component override height" do
      result = render_component(ColorBarLegendComponent, id: :id, data: @data, height: 2)
      assert result =~ "resource-usage-legend-entry-2"
      refute result =~ "resource-usage-legend-entry-3"
    end

    test "color bar component override formatter" do
      result =
        render_component(ColorBarLegendComponent, id: :id, data: @data, fn_format: &custom_f(&1))

      refute result =~ "4.0%"
      assert result =~ "400"
    end
  end

  defp custom_f(val), do: val * 100
end
