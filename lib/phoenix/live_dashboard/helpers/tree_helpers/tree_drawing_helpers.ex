defmodule Phoenix.LiveDashboard.TreeDrawingHelpers do
  @node_x_separation 50
  def extract_nodes(%{children: children} = node) do
    node = Map.delete(node, :children)
    [node | Enum.reduce(children, [], &(extract_nodes(&1) ++ &2))]
  end

  def extract_lines(%{children: children} = node) do
    lines_to_children = lines_to_children(node)

    aditional_lines =
      cond do
        [node] == children ->
          [child | _] = children
          line_from_parent(node, child)

        match?([_ | _], children) ->
          [child | _] = children
          [vertical_line(node, child), line_from_parent(node, child)]

        true ->
          []
      end

    children_lines = Enum.reduce(children, [], &(extract_lines(&1) ++ &2))
    lines_to_children ++ aditional_lines ++ children_lines
  end

  defp line_from_parent(node, child) do
    %{
      x1: node.x + node.width,
      x2: child.x - @node_x_separation / 2,
      y1: node.y + node.height / 2,
      y2: node.y + node.height / 2
    }
  end

  defp vertical_line(%{children: children} = node, child) do
    [top_most_child | _] = children
    [bottom_most_child | _] = Enum.reverse(children)

    %{
      x1: child.x - @node_x_separation / 2,
      x2: child.x - @node_x_separation / 2,
      y1: top_most_child.y + node.height / 2,
      y2: bottom_most_child.y + node.height / 2
    }
  end

  defp lines_to_children(%{children: children} = node) do
    Enum.reduce(children, [], fn n, acc ->
      [
        %{
          x1: n.x - @node_x_separation / 2,
          x2: n.x,
          y1: n.y + node.height / 2,
          y2: n.y + node.height / 2
        }
        | acc
      ]
    end)
  end

  def svg_size(nodes) do
    node_y = Enum.max_by(nodes, fn x -> x.y end)
    node_x = Enum.max_by(nodes, fn x -> x.x end)
    {node_x.x + node_x.width, node_y.y + node_y.height}
  end
end
