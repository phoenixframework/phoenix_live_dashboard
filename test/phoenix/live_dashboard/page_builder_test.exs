defmodule Phoenix.LiveDashboard.PageBuilderTest do
  use ExUnit.Case, async: true
  import Phoenix.LiveViewTest
  import Phoenix.Component
  import Phoenix.LiveDashboard.PageBuilder

  test "card/1" do
    assigns = %{}

    result =
      rendered_to_string(~H"""
      <.card
        title="test-title"
        hint="test-hint"
        inner_title="test-inner-title"
        inner_hint="test-inner-hint"
      >
        test-value
      </.card>
      """)

    assert result =~ ~r|<h5 class=\"card-title\">[\r\n\s]*test-title[\r\n\s]*|
    assert result =~ ~S|<div class="hint-text">test-hint</div>|
    assert result =~ ~S|<div class="banner-card mt-auto">|
    assert result =~ ~r|<h6 class=\"banner-card-title\">[\r\n\s]*test-inner-title[\r\n\s]*|
    assert result =~ ~S|<div class="hint-text">test-inner-hint</div>|
    assert result =~ ~r|<div class="banner-card-value">[\r\n\s]*test-value[\r\n\s]*</div>|
  end

  describe "row/1" do
    test "renders columns" do
      assigns = %{}
      result = rendered_to_string(~H{<.row>
  <:col>1</:col>
  <:col>2</:col>
</.row>})

      assert result =~
               ~r{<div class="row">[\r\n\s]*<div class="col-sm-6 mb-4 flex-column d-flex">[\r\n\s]*1[\r\n\s]*</div>[\r\n\s]*<div class="col-sm-6 mb-4 flex-column d-flex">[\r\n\s]*2[\r\n\s]*</div>[\r\n\s]*</div>}
    end

    test "validates the number of col" do
      msg = "row component must have at least 1 and at most 3 :col, got: 4"

      assigns = %{}

      assert_raise ArgumentError, msg, fn ->
        rendered_to_string(~H"""
        <.row>
          <:col></:col>
          <:col></:col>
          <:col></:col>
          <:col></:col>
        </.row>
        """)
      end

      msg = "row component must have at least 1 and at most 3 :col, got: 0"

      assert_raise ArgumentError, msg, fn ->
        rendered_to_string(~H"<.row />")
      end
    end
  end

  test "fields_card_component" do
    assigns = %{}

    result =
      rendered_to_string(~H"""
      <.fields_card
        fields={[foo: "123", bar: "456"]}
        title="test-title"
        hint="test-hint"
        inner_title="test-inner-title"
        inner_hint="test-inner-hint"
      />
      """)

    assert result =~ ~r|<h5 class=\"card-title\">[\r\n\s]*test-title[\r\n\s]*|
    assert result =~ ~S|<div class="hint-text">test-hint</div>|
    assert result =~ ~r|<h6 class=\"card-title\">[\r\n\s]*test-inner-title[\r\n\s]*|
    assert result =~ ~S|<div class="hint-text">test-inner-hint</div>|
    assert result =~ ~r|<dt class=\"pb-1\">(foo\|bar)<\/dt>|

    assert result =~
             ~r|<textarea class=\"code-field text-monospace\" readonly=\"readonly\" rows=\"1\">(123\|456)<\/textarea>|
  end

  test "shared_usage_card/1" do
    assigns = %{}

    result =
      rendered_to_string(~H"""
      <.shared_usage_card
        usages={[
          %{
            data: [{"foo", 123, "green", nil}, {"bar", 456, "blue", nil}],
            dom_id: "sub-id",
            title: "test-usage-title"
          }
        ]}
        total_data={[
          {"foo", 1000, "green", nil},
          {"bar", 2000, "blue", nil}
        ]}
        total_legend="test-total-legend"
        total_usage="test-total-usage"
        dom_id="test-dom-id"
        title="test-title"
        inner_title="test-inner-title"
        hint="test-hint"
        inner_hint="test-inner-hint"
        total_formatter={&"test-format-#{&1}"}
        csp_nonces={%{style: "style_nonce", script: "script_nonce"}}
      />
      """)

    assert result =~ ~r|<h5 class=\"card-title\">[\r\n\s]*test-title[\r\n\s]*|
    assert result =~ ~S|<div class="hint-text">test-hint</div>|

    assert result =~ ~r|<h5 class=\"card-title\">[\r\n\s]*test-inner-title[\r\n\s]*|
    assert result =~ ~S|<div class="hint-text">test-inner-hint</div>|

    assert result =~ ~S|<span class="color-bar-progress-title">test-usage-title</span>|

    assert result =~
             ~r|<style nonce="style_nonce">\s*#test-dom-id-sub-id-progress-(1\|2){width:(123\|456)%}\s*</style>|

    assert result =~ ~r|title=\"(foo\|bar) - (123\|456)%\"|
    assert result =~ ~r|class=\"progress-bar color-bar-progress-bar bg-gradient-(blue\|green)\"|
    assert result =~ ~r|data-name=\"(foo\|bar)\"|
    assert result =~ ~r|id=\"test-dom-id-sub-id-progress-(0\|1)\"|

    assert result =~ ~r|color-bar-legend-entry\" data-name=\"(foo\|bar)\"|
    assert result =~ ~r|<div class="color-bar-legend-color bg-(blue\|green) mr-2"></div>|
    assert result =~ ~r|<span>(foo\|bar)[\r\n\s]*</span>|

    assert result =~
             ~r|<div class=\"resource-usage-total text-center py-1 mt-3\">[\r\n\s]*test-total-legend test-total-usage[\r\n\s]*</div>|
  end

  test "usage_card/1" do
    assigns = %{}

    result =
      rendered_to_string(~H"""
      <.usage_card
        dom_id="test-dom-id"
        title="test-title"
        hint="test-hint"
        csp_nonces={%{style: "style_nonce", script: "script_nonce"}}
      >
        <:usage
          current={10}
          limit={150}
          dom_id="test-dom-sub-id"
          title="test-usage-title"
          hint="test-usage-hint"
          percent={13}
        />
      </.usage_card>
      """)

    assert result =~ ~r|<h5 class=\"card-title\">[\r\n\s]*test-title[\r\n\s]*|
    assert result =~ ~S|<div class="hint-text">test-hint</div>|

    assert result =~ ~r|<div>[\r\n\s]*test-usage-title[\r\n\s]*|
    assert result =~ ~S|<div class="hint-text">test-usage-hint</div>|

    assert result =~ ~r|<small class=\"text-muted pr-2\">[\r\n\s]*10 / 150[\r\n\s]*<\/small>|
    assert result =~ ~r|<strong>[\r\n\s]*13%[\r\n\s]*</strong>|

    assert result =~
             ~r|<style nonce=\"style_nonce\">\s*#test-dom-id-test-dom-sub-id-progress{width:13%}\s*<\/style>|
  end
end
