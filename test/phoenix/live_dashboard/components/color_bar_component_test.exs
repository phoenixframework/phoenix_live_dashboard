defmodule Phoenix.LiveDashboard.ColorBarComponentTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.ColorBarComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  @data [
    {"In use", 4.0, "purple", "unused"}
  ]

  describe "rendering" do
    test "color bar component" do
      result =
        render_component(ColorBarComponent,
          data: @data,
          title: "Hello",
          csp_nonces: %{img: "img_nonce", style: "style_nonce", script: "script_nonce"},
          dom_id: "color-bar"
        )

      assert result =~ "bg-gradient-purple"
      assert result =~ "aria-valuenow=\"4.0\""
      assert result =~ ~R|<style nonce="style_nonce">#.*\{width:4.0%\}|
      assert result =~ "title=\"In use - 4.0%\""
      assert result =~ "<span class=\"color-bar-progress-title\">Hello</span>"
      refute result =~ "unused"
    end
  end
end
