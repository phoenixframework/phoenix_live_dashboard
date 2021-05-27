defmodule Phoenix.LiveDashboard.UsageCardComponentTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.UsageCardComponent

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
