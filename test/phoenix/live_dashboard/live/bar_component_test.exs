defmodule Phoenix.LiveDashboard.BarComponentTest do
  use ExUnit.Case, async: true
  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.BarComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint


  describe "rendering" do
    test "color bar component left" do
      result = render_bar(0.1, :left, "test-class")
      assert result =~ "123"
      assert result =~ "style=\"width: 0.1%\""
      assert result =~ "flex-row-reverse"
      assert result =~ "div class=\"test-class\""
    end
    test "color bar component" do
      result = render_bar(1.1, :right, "test-class")
      assert result =~ "123"
      assert result =~ "style=\"width: 1.1%\""
      refute result =~ "flex-row-reverse"
    end
  end

  defp render_bar(percent, dir, class) do
    render_component(BarComponent, id: :id, percent: percent, dir: dir, class: class, inner_content: fn _ -> "123" end)
  end
end
