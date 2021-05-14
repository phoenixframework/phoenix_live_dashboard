defmodule Phoenix.LiveDashboard.SharedUsageCardComponentTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.SharedUsageCardComponent

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
