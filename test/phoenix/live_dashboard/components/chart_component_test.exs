defmodule Phoenix.LiveDashboard.ChartComponentTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveViewTest

  alias Phoenix.LiveDashboard.ChartComponent

  defp render_chart(assigns) do
    defaults = %{
      id: "123",
      full_width: false,
      title: "Default title",
      hint: "Default hint",
      data: [],
      kind: :last_value,
      label: "Default label",
      tags: [],
      unit: "",
      prune_threshold: 1_000,
      bucket_size: 20
    }

    assigns = Map.merge(defaults, Map.new(assigns))
    render_component(ChartComponent, assigns)
  end

  describe "rendering" do
    test "renders full_width" do
      result = render_chart(full_width: true)
      assert result =~ ~s|<div class="col-12 charts-col">|

      result = render_chart(full_width: false)
      assert result =~ ~s|<div class="col-xl-6 col-xxl-4 col-xxxl-3 charts-col">|
    end

    test "renders title" do
      result = render_chart(title: "Test title")
      assert result =~ ~s|data-title="Test title"|
    end

    test "renders kind" do
      result = render_chart(kind: "last_value")
      assert result =~ ~s|data-metric="last_value"|
    end

    test "renders unit" do
      result = render_chart(unit: "megabyte")
      assert result =~ ~s|data-unit="megabyte"|

      result = render_chart(unit: "whatever")
      assert result =~ ~s|data-unit="whatever"|
    end

    test "renders tags" do
      result = render_chart(tags: ["foo", "bar"])
      assert result =~ ~s|data-tags="foo-bar"|
    end

    test "renders max number of events" do
      result = render_chart(prune_threshold: 5)
      assert result =~ ~s|data-prune-threshold="5"|
    end

    test "renders data" do
      result = render_chart(data: [{"x", "y", "z"}])
      assert result =~ ~s|<span data-x="x" data-y="y" data-z="z" id="x-y-z">|

      result = render_chart(label: "Count", data: [{nil, "y", "z"}])
      assert result =~ ~s|<span data-x="Count" data-y="y" data-z="z" id="Count-y-z">|
    end

    test "renders a description hint" do
      description = "test description"
      result = render_chart(hint: description, data: [{"x", "y", "z"}])
      assert result =~ description

      result = render_chart(data: [{"x", "y", "z"}])
      refute result =~ description
    end

    test "renders bucket size" do
      result = render_chart(bucket_size: nil)
      refute result =~ ~s|data-bucket-size=|

      result = render_chart(bucket_size: 50)
      assert result =~ ~s|data-bucket-size="50"|
    end
  end

  describe "validates" do
    test "bucket_size" do
      msg = ":bucket_size must be a positive integer, got: -1"

      assert_raise ArgumentError, msg, fn ->
        render_chart(bucket_size: -1)
      end

      msg = ":bucket_size must be a positive integer, got: true"

      assert_raise ArgumentError, msg, fn ->
        render_chart(bucket_size: true)
      end
    end

    test "prune_threshold" do
      msg = ":prune_threshold must be a positive integer, got: -1"

      assert_raise ArgumentError, msg, fn ->
        render_chart(prune_threshold: -1)
      end

      msg = ":prune_threshold must be a positive integer, got: true"

      assert_raise ArgumentError, msg, fn ->
        render_chart(prune_threshold: true)
      end
    end
  end
end
