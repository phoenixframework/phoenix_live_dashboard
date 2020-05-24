defmodule Phoenix.LiveDashboard.ColorBarLegendComponentTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.ColorBarLegendComponent
  import Phoenix.LiveViewTest

  @endpoint Phoenix.LiveDashboardTest.Endpoint

  @data [
    {"In use", 4.0, "purple", "Hint"}
  ]

  describe "rendering" do
    test "color bar component" do
      result = render_component(ColorBarLegendComponent, data: @data)
      assert result =~ "bg-purple"
      assert result =~ "4.0%"
      assert result =~ "<div class=\"hint\">"
      assert result =~ "Hint"
    end

    test "override formatter" do
      result = render_component(ColorBarLegendComponent, data: @data, formatter: &formatter(&1))
      refute result =~ "4.0%"
      assert result =~ "400"
    end
  end

  defp formatter(val), do: val * 100
end
