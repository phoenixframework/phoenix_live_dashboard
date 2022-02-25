defmodule Phoenix.LiveDashboard.SharedUsageCardComponentTest do
  use ExUnit.Case, async: true
  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.SharedUsageCardComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  describe "rendering" do
    test "card component" do
      result =
        render_component(SharedUsageCardComponent,
          usages: [
            %{
              data: [{"foo", 123, "green", nil}, {"bar", 456, "blue", nil}],
              dom_sub_id: "test-dom-sub-id",
              title: "test-usage-title"
            }
          ],
          total_data: [
            {"foo", 1000, "green", nil},
            {"bar", 2000, "blue", nil}
          ],
          total_legend: "test-total-legend",
          total_usage: "test-total-usage",
          dom_id: "test-dom-id",
          title: "test-title",
          inner_title: "test-inner-title",
          hint: "test-hint",
          inner_hint: "test-inner-hint",
          total_formatter: &"test-format-#{&1}",
          csp_nonces: %{img: "img_nonce", style: "style_nonce", script: "script_nonce"}
        )

      assert result =~ ~r|<h5 class=\"card-title\">[\r\n\s]*test-title[\r\n\s]*|
      assert result =~ ~S|<div class="hint-text">test-hint</div>|

      assert result =~ ~r|<h5 class=\"card-title\">[\r\n\s]*test-inner-title[\r\n\s]*|
      assert result =~ ~S|<div class="hint-text">test-inner-hint</div>|

      assert result =~ ~S|<span class="color-bar-progress-title">test-usage-title</span>|

      assert result =~
               ~r|<style nonce="style_nonce">#cpu-test-dom-sub-id-progress-(1\|2){width:(123\|456)%}</style>|

      assert result =~ ~r|title=\"(foo\|bar) - (123\|456)%\"|
      assert result =~ ~r|class=\"progress-bar color-bar-progress-bar bg-gradient-(blue\|green)\"|
      assert result =~ ~r|data-name=\"(foo\|bar)\"|
      assert result =~ ~r|id=\"cpu-test-dom-sub-id-progress-(0\|1)\"|

      assert result =~ ~r|color-bar-legend-entry\" data-name=\"(foo\|bar)\"|
      assert result =~ ~r|<div class="color-bar-legend-color bg-(blue\|green) mr-2"></div>|
      assert result =~ ~r|<span>(foo\|bar)[\r\n\s]*</span>|

      assert result =~
               ~r|<div class=\"resource-usage-total text-center py-1 mt-3\">[\r\n\s]*test-total-legend test-total-usage[\r\n\s]*</div>|
    end
  end

  describe "normalize_params/1" do
    test "validates required params" do
      msg = "the :usages parameter is expected in shared usage card component"

      assert_raise ArgumentError, msg, fn ->
        SharedUsageCardComponent.normalize_params(%{})
      end

      msg = "the :total_data parameter is expected in shared usage card component"

      assert_raise ArgumentError, msg, fn ->
        SharedUsageCardComponent.normalize_params(%{
          usages: [%{data: [], dom_sub_id: "dom-sub-id"}]
        })
      end

      msg = "the :total_legend parameter is expected in shared usage card component"

      assert_raise ArgumentError, msg, fn ->
        SharedUsageCardComponent.normalize_params(%{
          usages: [%{data: [], dom_sub_id: "dom-sub-id"}],
          total_data: []
        })
      end

      msg = "the :total_usage parameter is expected in shared usage card component"

      assert_raise ArgumentError, msg, fn ->
        SharedUsageCardComponent.normalize_params(%{
          usages: [%{data: [], dom_sub_id: "dom-sub-id"}],
          total_data: [],
          total_legend: "total-legend"
        })
      end

      msg = "the :dom_id parameter is expected in shared usage card component"

      assert_raise ArgumentError, msg, fn ->
        SharedUsageCardComponent.normalize_params(%{
          usages: [%{data: [], dom_sub_id: "dom-sub-id"}],
          total_data: [],
          total_legend: "total-legend",
          total_usage: "total-usage"
        })
      end
    end

    test "validates required params in :usages field" do
      msg =
        "the :data parameter is expected in parent :usages parameter of shared usage card component"

      assert_raise ArgumentError, msg, fn ->
        SharedUsageCardComponent.normalize_params(%{
          usages: [%{}],
          total_data: [],
          total_legend: "total-legend",
          total_usage: "total-usage",
          dom_id: "dom-id"
        })
      end

      msg =
        "the :dom_sub_id parameter is expected in parent :usages parameter of shared usage card component"

      assert_raise ArgumentError, msg, fn ->
        SharedUsageCardComponent.normalize_params(%{
          usages: [%{data: []}],
          total_data: [],
          total_legend: "total-legend",
          total_usage: "total-usage",
          dom_id: "dom-id"
        })
      end
    end

    test "adds default values" do
      assert %{
               hint: nil,
               inner_hint: nil,
               inner_title: nil,
               csp_nonces: %{img: nil, script: nil, style: nil},
               dom_id: "dom-id",
               total_data: [],
               title: nil,
               total_formatter: fun,
               total_legend: "total-legend",
               total_usage: "total-usage",
               usages: [%{data: [], dom_sub_id: "dom-sub-id", title: nil}]
             } =
               SharedUsageCardComponent.normalize_params(%{
                 usages: [%{data: [], dom_sub_id: "dom-sub-id"}],
                 total_data: [],
                 total_legend: "total-legend",
                 total_usage: "total-usage",
                 dom_id: "dom-id"
               })

      assert is_function(fun, 1)
    end
  end
end
