defmodule Phoenix.LiveDashboard.ColorBarComponentTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.ColorBarComponent
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  @data [
    {:in_use_memory, "In use", 4.0, "purple"}
  ]

  describe "rendering" do
    test "color bar component" do
      result = render_bar(@data)
      assert result =~ "bg-gradient-purple"
      assert result =~ "aria-valuenow=\"4.0\""
      assert result =~ "style=\"width: 4.0%\""
      assert result =~ "title=\"In use - 4.0%\""
    end
  end

  defp render_bar(data) do
    render_component(ColorBarComponent, id: :id, data: data)
  end
end
