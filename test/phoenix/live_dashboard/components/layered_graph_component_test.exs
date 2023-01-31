defmodule Phoenix.LiveDashboard.LayeredGraphComponentTest do
  use ExUnit.Case, async: true

  use Phoenix.Component
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  alias Phoenix.LiveDashboard.LayeredGraphComponent

  describe "normalize_params/1" do
    test "normalize layers" do
      assert %{layers: _} = LayeredGraphComponent.normalize_params(%{layer: []})

      assert %{layers: _} =
               LayeredGraphComponent.normalize_params(%{
                 layer: [
                   %{nodes: [%{id: 0, children: [1, 2], data: "0"}]},
                   %{
                     nodes: [%{id: 1, children: [], data: "1"}, %{id: 2, children: [], data: "2"}]
                   }
                 ]
               })

      assert_raise(ArgumentError, ~r/:layer slot must receive a list of nodes, got:/, fn ->
        # Without ID
        LayeredGraphComponent.normalize_params(%{
          layer: [%{nodes: [%{data: "0", children: [1, 2]}]}]
        })
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
        render_component(
          fn assigns ->
            ~H"""
            <.live_component
                module={LayeredGraphComponent}
                id="id" title={@title} hint={@hint} format_detail={@format_detail}>
              <:layer :for={nodes <- @layers} nodes={nodes} />
            </.live_component>
            """
          end,
          %{layers: layers, format_detail: format_detail, hint: hint, title: title}
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
        render_component(
          fn assigns ->
            ~H"""
            <.live_component module={LayeredGraphComponent} id="id" title="a graph" hint= "don't overlap">
              <:layer :for={nodes <- @layers} nodes={nodes} />
            </.live_component>
            """
          end,
          %{layers: layers}
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
        render_component(
          fn assigns ->
            ~H"""
            <.live_component module={LayeredGraphComponent} id="id" title="with a grid">
              <:layer :for={nodes <- @layers} nodes={nodes} />
            </.live_component>
            """
          end,
          %{layers: layers}
        )

      refute content =~ ~s[fill="url(#grid)"]

      content =
        render_component(
          fn assigns ->
            ~H"""
            <.live_component module={LayeredGraphComponent} show_grid?={true} id="id" title="with a grid">
              <:layer :for={nodes <- @layers} nodes={nodes} />
            </.live_component>
            """
          end,
          %{layers: layers}
        )

      assert content =~ ~s[fill="url(#grid)"]
    end
  end
end
