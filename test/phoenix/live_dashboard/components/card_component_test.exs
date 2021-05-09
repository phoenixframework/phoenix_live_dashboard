defmodule Phoenix.LiveDashboard.CardComponentTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.CardComponent

  describe "normalize_params/1" do
    test "validates required params" do
      msg = "the :value parameter is expected in card component"

      assert_raise ArgumentError, msg, fn ->
        CardComponent.normalize_params(%{})
      end
    end
  end
end
