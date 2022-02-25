defmodule Phoenix.LiveDashboard.UsageCardComponentTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.UsageCardComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  describe "rendering" do
    test "usage card component" do
      result =
        render_component(UsageCardComponent,
          usages: [
            %{
              current: 10,
              limit: 150,
              dom_sub_id: "test-dom-sub-id",
              title: "test-usage-title",
              hint: "test-usage-hint",
              percent: 13
            }
          ],
          dom_id: "test-dom-id",
          title: "test-title",
          hint: "test-hint",
          csp_nonces: %{img: "img_nonce", style: "style_nonce", script: "script_nonce"}
        )

      assert result =~ ~r|<h5 class=\"card-title\">[\r\n\s]*test-title[\r\n\s]*|
      assert result =~ ~S|<div class="hint-text">test-hint</div>|

      assert result =~ ~r|<div>[\r\n\s]*test-usage-title[\r\n\s]*|
      assert result =~ ~S|<div class="hint-text">test-usage-hint</div>|

      assert result =~ ~r|<small class=\"text-muted pr-2\">[\r\n\s]*10 / 150[\r\n\s]*<\/small>|
      assert result =~ ~r|<strong>[\r\n\s]*13%[\r\n\s]*</strong>|

      assert result =~
               ~r|<style nonce=\"style_nonce\">#test-dom-id-test-dom-sub-id-progress{width:13%}<\/style>|
    end
  end

  describe "normalize_params/1" do
    test "validates required params" do
      msg = "the :usages parameter is expected in usage card component"

      assert_raise ArgumentError, msg, fn ->
        UsageCardComponent.normalize_params(%{})
      end

      msg = "the :dom_id parameter is expected in usage card component"

      assert_raise ArgumentError, msg, fn ->
        UsageCardComponent.normalize_params(%{usages: []})
      end
    end

    test "validates required params in :usages field" do
      msg =
        "the :current parameter is expected in parent :usages parameter of usage card component"

      assert_raise ArgumentError, msg, fn ->
        UsageCardComponent.normalize_params(%{
          usages: [%{}],
          dom_id: "test-dom-id"
        })
      end

      msg = "the :limit parameter is expected in parent :usages parameter of usage card component"

      assert_raise ArgumentError, msg, fn ->
        UsageCardComponent.normalize_params(%{
          usages: [%{current: 10}],
          dom_id: "test-dom-id"
        })
      end

      msg =
        "the :dom_sub_id parameter is expected in parent :usages parameter of usage card component"

      assert_raise ArgumentError, msg, fn ->
        UsageCardComponent.normalize_params(%{
          usages: [%{current: 10, limit: 150}],
          dom_id: "test-dom-id"
        })
      end

      msg = "the :title parameter is expected in parent :usages parameter of usage card component"

      assert_raise ArgumentError, msg, fn ->
        UsageCardComponent.normalize_params(%{
          usages: [%{current: 10, limit: 150, dom_sub_id: "test-dom-sub-id"}],
          dom_id: "test-dom-id"
        })
      end
    end

    test "adds default values" do
      assert %{
               csp_nonces: %{img: nil, script: nil, style: nil},
               dom_id: "test-dom-id",
               hint: nil,
               title: nil,
               usages: [
                 %{
                   current: 10,
                   dom_sub_id: "test-dom-sub-id",
                   hint: nil,
                   limit: 150,
                   percent: nil,
                   title: "test-title"
                 }
               ]
             } =
               UsageCardComponent.normalize_params(%{
                 usages: [
                   %{
                     current: 10,
                     limit: 150,
                     dom_sub_id: "test-dom-sub-id",
                     title: "test-title"
                   }
                 ],
                 dom_id: "test-dom-id"
               })
    end
  end
end
