defmodule Phoenix.LiveDashboard.RowComponentTest do
  use ExUnit.Case, async: true
  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.RowComponent
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
    test "one row in row component" do
      result =
        render_component(RowComponent,
          components: [{SimpleComponent, %{text: "test-text"}}]
        )

      assert result =~ ~r|<div class=\"row\">[\r\n\s]*<div>test-text<\/div>[\r\n\s]*<\/div>|
    end

    test "three rows in row component" do
      result =
        render_component(RowComponent,
          components: [
            {SimpleComponent, %{text: "test-text-1"}},
            {SimpleComponent, %{text: "test-text-2"}},
            {SimpleComponent, %{text: "test-text-3"}}
          ]
        )

      assert result =~
               ~r|<div class=\"row\">[\r\n\s]*<div>test-text-1<\/div>[\r\n\s]*<div>test-text-2<\/div>[\r\n\s]*<div>test-text-3<\/div>[\r\n\s]*<\/div>|
    end
  end

  describe "normalize_params/1" do
    test "validates required params" do
      msg = "the :components parameter is expected in row component"

      assert_raise ArgumentError, msg, fn ->
        RowComponent.normalize_params(%{})
      end
    end

    test "normalizes columns" do
      msg = ":components must have at least 1 component and at most 3 components, got: 0"

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
