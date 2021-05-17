defmodule Phoenix.LiveDashboard.FieldsCardComponentTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.FieldsCardComponent

  describe "normalize_params/1" do
    test "validates required params" do
      msg = "the :fields parameter is expected in fields card component"

      assert_raise ArgumentError, msg, fn ->
        FieldsCardComponent.normalize_params(%{})
      end
    end
  end
end
