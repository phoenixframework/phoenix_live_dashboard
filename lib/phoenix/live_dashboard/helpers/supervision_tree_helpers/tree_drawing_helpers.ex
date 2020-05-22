defmodule Phoenix.LiveDashboard.TreeDrawingHelpers do
  @node_height 20
  @node_width 100
  @node_x_separation 50
  def extract_nodes(%{children: children} = node) do
    node = Map.delete(node, :children)
    [node | Enum.reduce(children, [], &(extract_nodes(&1) ++ &2))]
  end

  def extract_lines(%{children: children} = node) do
    lines_to_children =
      Enum.reduce(children, [], fn n, acc ->
        [
          %{
            x1: node.x + @node_width + @node_x_separation / 2,
            x2: n.x,
            y1: n.y + @node_height / 2,
            y2: n.y + @node_height / 2
          }
          | acc
        ]
      end)

    children_number = Enum.count(children)

    aditional_lines =
      if children_number > 0 do
        if children_number >= 2 do
          top_children = Enum.max_by(children, fn x -> x.y end)
          bottom_children = Enum.min_by(children, fn x -> x.y end)

          line_from_parent = %{
            x1: node.x + @node_width,
            x2: node.x + @node_width + @node_x_separation / 2,
            y1: node.y + @node_height / 2,
            y2: node.y + @node_height / 2
          }

          vertical_line = %{
            x1: node.x + @node_width + @node_x_separation / 2,
            x2: node.x + @node_width + @node_x_separation / 2,
            y1: top_children.y + @node_height / 2,
            y2: bottom_children.y + @node_height / 2
          }

          [line_from_parent, vertical_line]
        else
          [
            %{
              x1: node.x + @node_width,
              x2: node.x + @node_width + @node_x_separation / 2,
              y1: node.y + @node_height / 2,
              y2: node.y + @node_height / 2
            }
          ]
        end
      else
        []
      end

    lines_to_children ++ aditional_lines ++ Enum.reduce(children, [], &(extract_lines(&1) ++ &2))
  end

  def svg_size(nodes) do
    node_y = Enum.max_by(nodes, fn x -> x.y end)
    node_x = Enum.max_by(nodes, fn x -> x.x end)
    {node_x.x + @node_width, node_y.y + @node_height}
  end
end
