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
          csp_nonces: %{img: "img_nonce", style: "style_nonce", script: "script_nonce"},
          dom_id: "title-bar",
          inner_block: [%{slot: :__inner_block__, inner_block: fn _, _ -> "123" end}]
        )

      assert result =~ "123"
      assert result =~ ~R|<style nonce="style_nonce">\s*#.*\{width:0.1%\}|
      assert result =~ ~r|<div class="test-class"|
    end

    test "handles negative and over-max percent values" do
      result_negative = render_component(TitleBarComponent,
        percent: -0.5,
        class: "test-class",
        csp_nonces: %{img: "img_nonce", style: "style_nonce", script: "script_nonce"},
        dom_id: "title-bar",
        inner_block: [%{slot: :__inner_block__, inner_block: fn _, _ -> "Negative" end}]
      )

      assert result_negative =~ "Negative"
      assert result_negative =~ ~R|<style nonce="style_nonce">\s*#.*\{width:0%\}|

      result_over_max = render_component(TitleBarComponent,
        percent: 1.5,
        class: "test-class",
        csp_nonces: %{img: "img_nonce", style: "style_nonce", script: "script_nonce"},
        dom_id: "title-bar",
        inner_block: [%{slot: :__inner_block__, inner_block: fn _, _ -> "Over max" end}]
      )

      assert result_over_max =~ "Over max"
      assert result_over_max =~ ~R|<style nonce="style_nonce">\s*#.*\{width:100%\}|
    end

    test "handles empty or missing nonces" do
      result_empty_nonce = render_component(TitleBarComponent,
        percent: 0.5,
        class: "test-class",
        csp_nonces: %{img: "", style: "style_nonce", script: ""},
        dom_id: "title-bar",
        inner_block: [%{slot: :__inner_block__, inner_block: fn _, _ -> "Empty nonce" end}]
      )

      assert result_empty_nonce =~ "Empty nonce"
      assert result_empty_nonce =~ ~R|<style nonce="style_nonce">\s*#.*\{width:50%\}|
      
      result_missing_nonce = render_component(TitleBarComponent,
        percent: 0.5,
        class: "test-class",
        dom_id: "title-bar",
        inner_block: [%{slot: :__inner_block__, inner_block: fn _, _ -> "Missing nonce" end}]
      )

      assert result_missing_nonce =~ "Missing nonce"
      assert result_missing_nonce =~ ~R|<style>\s*#.*\{width:50%\}|
    end

    test "renders without inner_block" do
      result_no_inner_block = render_component(TitleBarComponent,
        percent: 0.5,
        class: "test-class",
        csp_nonces: %{img: "img_nonce", style: "style_nonce", script: "script_nonce"},
        dom_id: "title-bar"
      )

      assert result_no_inner_block =~ ~R|<style nonce="style_nonce">\s*#.*\{width:50%\}|
    end
  end
end
