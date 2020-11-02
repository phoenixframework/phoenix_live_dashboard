defmodule Phoenix.LiveDashboard.TitleBarComponentTest do
  use ExUnit.Case, async: true
  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.TitleBarComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  describe "rendering" do
    test "title bar component" do
      result =
        render_component(TitleBarComponent,
          percent: 0.1,
          class: "test-class",
          inner_content: fn _ -> "123" end,
          csp_nonces: %{img: "img_nonce", style: "style_nonce", script: "script_nonce"},
          dom_id: "title-bar"
        )

      assert result =~ "123"
      assert result =~ ~R|<style nonce="style_nonce">#.*\{width:0.1%\}|
      assert result =~ "div class=\"test-class\""
    end
  end
end
