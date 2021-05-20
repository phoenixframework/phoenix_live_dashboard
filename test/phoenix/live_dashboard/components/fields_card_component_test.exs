defmodule Phoenix.LiveDashboard.FieldsCardComponentTest do
  use ExUnit.Case, async: true
  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.FieldsCardComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  describe "rendering" do
    test "fields card component" do
      result =
        render_component(FieldsCardComponent,
          fields: [foo: "123", bar: "456"],
          title: "test-title",
          hint: "test-hint",
          inner_title: "test-inner-title",
          inner_hint: "test-inner-hint"
        )

      assert result =~ ~r|<h5 class=\"card-title\">[\r\n\s]*test-title[\r\n\s]*|
      assert result =~ ~S|<div class="hint-text">test-hint</div>|
      assert result =~ ~r|<h6 class=\"card-title\">[\r\n\s]*test-inner-title[\r\n\s]*|
      assert result =~ ~S|<div class="hint-text">test-inner-hint</div>|
      assert result =~ ~r|<dt class=\"pb-1\">(foo\|bar)<\/dt>|

      assert result =~
               ~r|<textarea class=\"code-field text-monospace\" readonly=\"readonly\" rows=\"1\">(123\|456)<\/textarea>|
    end
  end

  describe "normalize_params/1" do
    test "validates required params" do
      msg = "the :fields parameter is expected in fields card component"

      assert_raise ArgumentError, msg, fn ->
        FieldsCardComponent.normalize_params(%{})
      end
    end

    test "adds default values" do
      assert %{
               fields: [foo: 123, bar: 456],
               hint: nil,
               inner_hint: nil,
               inner_title: nil,
               title: nil
             } =
               FieldsCardComponent.normalize_params(%{
                 fields: [foo: 123, bar: 456]
               })
    end
  end
end
