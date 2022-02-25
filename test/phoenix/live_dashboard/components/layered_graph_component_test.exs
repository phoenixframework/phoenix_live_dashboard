defmodule Phoenix.LiveDashboard.LayeredGraphComponentTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  alias Phoenix.LiveDashboard.LayeredGraphComponent

  setup_all do
    # TODO: remove this after updating live view with fix:
    # https://github.com/phoenixframework/phoenix_live_view/commit/c3dbe6bc0f78da95a24051ad5713c9a4f669c476
    Code.ensure_loaded(LayeredGraphComponent)

    :ok
  end

  describe "normalize_params/1" do
    test "validate layers" do
      assert %{layers: _} = LayeredGraphComponent.normalize_params(%{layers: []})

      assert %{layers: _} =
               LayeredGraphComponent.normalize_params(%{
                 layers: [
                   [%{id: 0, children: [1, 2], data: "0"}],
                   [%{id: 1, children: [], data: "1"}, %{id: 2, children: [], data: "2"}]
                 ]
               })

      assert_raise(ArgumentError, ~r/layers parameter is expected/, fn ->
        LayeredGraphComponent.normalize_params(%{})
      end)

      assert_raise(ArgumentError, ~r/layers parameter must be a list, got/, fn ->
        LayeredGraphComponent.normalize_params(%{layers: "foo"})
      end)

      assert_raise(ArgumentError, ~r/parameter must be a list of lists that contain nodes/, fn ->
        # Without ID
        LayeredGraphComponent.normalize_params(%{layers: [[%{data: "0", children: [1, 2]}]]})
      end)
    end
  end

  describe "rendering" do
    defp circles_and_arrows_count(content) do
      fragment = Floki.parse_fragment!(content)

      {
        length(Floki.find(fragment, ".layered-graph circle")),
        length(Floki.find(fragment, ".layered-graph line"))
      }
    end

    defp labels(content) do
      content
      |> Floki.parse_fragment!()
      |> Floki.find(".node-label")
      |> Floki.text(sep: " | ")
    end

    test "renders a basic broadway pipeline" do
      title = "my pipeline"
      hint = "a Broadway pipeline represented as a graph"

      layers = [
        [
          %{
            id: MyPipeline.Broadway.Producer_0,
            data: %{
              label: "prod_0",
              detail: 0
            },
            children: [MyPipeline.Broadway.Processor_default_0]
          }
        ],
        [
          %{
            id: MyPipeline.Broadway.Processor_default_0,
            data: %{
              detail: 1,
              label: "proc_1"
            },
            children: []
          }
        ]
      ]

      format_detail = fn data ->
        case data.detail do
          0 -> "zero"
          1 -> "one"
          _ -> "n_n"
        end
      end

      content =
        render_component(LayeredGraphComponent,
          layers: layers,
          hint: hint,
          title: title,
          format_detail: format_detail
        )

      assert content =~ hint
      assert content =~ title

      assert content =~ "<line"
      assert content =~ "<text"

      assert content =~ "prod_0"
      assert content =~ "zero"

      assert content =~ "proc_1"
      assert content =~ "one"

      assert circles_and_arrows_count(content) == {2, 1}
    end

    test "renders correctly in case of intercalation of nodes" do
      layers = [
        [
          %{id: "a1", data: "a1", children: ["b1", "b3", "b5"]},
          %{id: "a2", data: "a2", children: ["b2", "b4", "b6"]}
        ],
        [
          %{id: "b1", data: "b1", children: []},
          %{id: "b2", data: "b2", children: []},
          %{id: "b3", data: "b3", children: []},
          %{id: "b4", data: "b4", children: []},
          %{id: "b5", data: "b5", children: []},
          %{id: "b6", data: "b6", children: []}
        ]
      ]

      content =
        render_component(LayeredGraphComponent,
          layers: layers,
          hint: "don't overlap",
          title: "a graph"
        )

      assert content =~ "a1"
      assert content =~ "b6"

      assert circles_and_arrows_count(content) == {8, 6}

      assert labels(content) == "a1 | a2 | b1 | b3 | b5 | b2 | b4 | b6"
    end

    test "show_grid? option controls the grid display" do
      layers = [
        [
          %{id: "a1", data: "a1", children: ["b1"]}
        ],
        [
          %{id: "b1", data: "b1", children: []}
        ]
      ]

      content =
        render_component(LayeredGraphComponent,
          layers: layers,
          title: "with a grid"
        )

      refute content =~ ~s[fill="url(#grid)"]

      content =
        render_component(LayeredGraphComponent,
          layers: layers,
          show_grid?: true,
          title: "with a grid"
        )

      assert content =~ ~s[fill="url(#grid)"]
    end
  end
end
