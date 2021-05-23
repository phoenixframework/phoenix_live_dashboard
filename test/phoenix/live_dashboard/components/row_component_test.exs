defmodule Phoenix.LiveDashboard.RowComponentTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.RowComponent

  describe "normalize_params/1" do
    test "validates required params" do
      msg = "the :components parameter is expected in row component"

      assert_raise ArgumentError, msg, fn ->
        RowComponent.normalize_params(%{})
      end
    end

    test "normalizes columns" do
      msg = ":components must have at least 1 compoment and at most 3 components, got: 0"

      assert_raise ArgumentError, msg, fn ->
        RowComponent.normalize_params(%{
          components: []
        })
      end

      msg = ":components must be a list, got: nil"

      assert_raise ArgumentError, msg, fn ->
        RowComponent.normalize_params(%{
          components: nil
        })
      end
    end
  end
end
