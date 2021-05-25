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
  end
end
