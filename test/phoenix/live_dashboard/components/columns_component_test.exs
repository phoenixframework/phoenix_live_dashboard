defmodule Phoenix.LiveDashboard.ColumnsComponentTest do
  use ExUnit.Case, async: true
  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.ColumnsComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  defmodule SimpleComponent do
    use Phoenix.LiveComponent

    def render(assigns) do
      ~H"""
      <div><%= @text %></div>
      """
    end
  end

  describe "rendering" do
    test "one column in columns component" do
      result =
        render_component(ColumnsComponent,
          components: [{SimpleComponent, %{text: "test-text"}}],
          columns_class: "12"
        )

      assert result =~
               ~r|<div class=\"col-sm-12 mb-4 flex-column d-flex\">[\r\n\s]*<div>test-text<\/div>[\r\n\s]*<\/div>|
    end

    test "three columns in columns component" do
      result =
        render_component(ColumnsComponent,
          components: [
            {SimpleComponent, %{text: "test-text-1"}},
            {SimpleComponent, %{text: "test-text-2"}},
            {SimpleComponent, %{text: "test-text-3"}}
          ],
          columns_class: "4"
        )

      assert result =~
               ~r|<div class=\"col-sm-4 mb-4 flex-column d-flex\">[\r\n\s]*<div>test-text-(1\|2\|3)<\/div>[\r\n\s]*<\/div>|
    end
  end

  describe "normalize_params/1" do
    test "validates required params" do
      msg = "the :components parameter is expected in columns component"

      assert_raise ArgumentError, msg, fn ->
        ColumnsComponent.normalize_params(%{})
      end
    end

    test "normalizes columns" do
      msg = ":components must have at least 1 component and at most 3 components, got: 0"

      assert_raise ArgumentError, msg, fn ->
        ColumnsComponent.normalize_params(%{
          components: []
        })
      end

      msg = ":components must be a list, got: nil"

      assert_raise ArgumentError, msg, fn ->
        ColumnsComponent.normalize_params(%{
          components: nil
        })
      end
    end
  end
end
