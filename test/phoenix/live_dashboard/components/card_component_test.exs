defmodule Phoenix.LiveDashboard.CardComponentTest do
  use ExUnit.Case, async: true
  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.CardComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  describe "rendering" do
    test "card component" do
      result =
        render_component(CardComponent,
          value: "test-value",
          title: "test-title",
          hint: "test-hint",
          class: ["test-class-1", "test-class-2"],
          inner_title: "test-inner-title",
          inner_hint: "test-inner-hint"
        )

      assert result =~ ~r|<h5 class=\"card-title\">[\r\n\s]*test-title[\r\n\s]*|
      assert result =~ ~S|<div class="hint-text">test-hint</div>|
      assert result =~ ~S|<div class="banner-card mt-auto test-class-1 test-class-2">|
      assert result =~ ~r|<h6 class=\"banner-card-title\">[\r\n\s]*test-inner-title[\r\n\s]*|
      assert result =~ ~S|<div class="hint-text">test-inner-hint</div>|
      assert result =~ ~S|<div class="banner-card-value">test-value</div>|
    end
  end

  describe "normalize_params/1" do
    test "validates required params" do
      msg = "the :value parameter is expected in card component"

      assert_raise ArgumentError, msg, fn ->
        CardComponent.normalize_params(%{})
      end
    end

    test "adds default values" do
      assert %{
               class: [],
               hint: nil,
               inner_hint: nil,
               inner_title: nil,
               title: nil,
               value: "test-value"
             } =
               CardComponent.normalize_params(%{
                 value: "test-value"
               })
    end
  end
end
