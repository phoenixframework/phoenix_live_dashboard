defmodule Phoenix.LiveDashboard.TitleBarComponentTest do
  use ExUnit.Case, async: true
  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.TitleBarComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  describe "rendering" do
    test "color bar component" do
      result =
        render_component(TitleBarComponent,
          percent: 0.1,
          class: "test-class",
          inner_content: fn _ -> "123" end
        )

      assert result =~ "123"
      assert result =~ "style=\"width: 0.1%\""
      assert result =~ "div class=\"test-class\""
    end
  end
end
