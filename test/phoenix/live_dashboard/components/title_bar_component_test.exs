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
          csp_nonces: %{style: "style_nonce", script: "script_nonce"},
          dom_id: "title-bar",
          inner_block: [%{slot: :__inner_block__, inner_block: fn _, _ -> "123" end}]
        )

      assert result =~ "123"
      assert result =~ ~r|<style nonce="style_nonce">\s*#.*\{width:0.1%\}|
      assert result =~ "div class=\"test-class\""
    end
  end
end
