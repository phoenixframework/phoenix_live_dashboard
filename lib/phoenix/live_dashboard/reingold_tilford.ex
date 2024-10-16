defmodule Phoenix.LiveDashboard.ReingoldTilford do
  # Reingold-Tilford algorithm for drawing trees
  @moduledoc false

  @node_height 30
  @node_y_separation 10
  @total_y_distance @node_height + @node_y_separation
  @node_x_separation 50

  defmodule Node do
    @moduledoc false
    defstruct [:x, :y, :label, :children, :modifier, :type, :height, :width, :level, :value]
  end

  defmodule Line do
    @moduledoc false
    defstruct [:x1, :x2, :y1, :y2]
  end

  @doc """
  Returns all nodes in a ReingoldTilford tree.
  """
  def nodes(%{children: children} = node) do
    [node | Enum.flat_map(children, &nodes/1)]
  end

  @doc """
  Returns the dimensions of a canvas to render all given
  ReingoldTilford nodes.
  """
  def dimensions(nodes) do
    node_y = Enum.max_by(nodes, fn node -> node.y + node.height end)
    node_x = Enum.max_by(nodes, fn node -> node.x + node.width end)
    {node_x.x + node_x.width, node_y.y + node_y.height}
  end

  @doc """
  Builds a ReingoldTilfolrd tree.

  The given tree is in the shape `{value, [child]}`.
  The function receives the value and returns the
  node label. The label is used to compute its width.
  """
  def build(tree, fun) do
    tree
    |> change_representation(0, fun)
    |> calculate_initial_y(0, [])
    |> ensure_children_inside_screen()
    |> put_final_y_values(0)
    |> put_x_position()
  end

  defp change_representation({value, children}, level, fun) do
    children = Enum.map(children, &change_representation(&1, level + 1, fun))
    label = fun.(value)

    %Node{
      x: 0,
      y: 0,
      label: label,
      children: children,
      modifier: 0,
      type: if(children == [], do: :leaf, else: :subtree),
      height: @node_height,
      width: String.length(label) * 10,
      level: level,
      value: value
    }
  end

  defp calculate_initial_y(%{children: children} = node, previous_sibling, top_siblings) do
    {_, children} =
      children
      |> Enum.reduce({0, []}, fn n, {prev_sibling, nodes} ->
        new_node = calculate_initial_y(n, prev_sibling, nodes)
        {new_node.y, [new_node | nodes]}
      end)

    {first_child, last_child} =
      if node.type != :leaf do
        [last_child | _] = children
        [first_child | _] = Enum.reverse(children)
        {first_child, last_child}
      else
        {nil, nil}
      end

    new_node =
      case {node_type(node), top_siblings} do
        {:leaf, []} ->
          %{node | y: 0}

        {:leaf, _} ->
          %{node | y: previous_sibling + @total_y_distance}

        {:small_subtree, []} ->
          %{node | y: first_child.y}

        {:small_subtree, _} ->
          %{
            node
            | y: previous_sibling + @total_y_distance,
              modifier: previous_sibling + @total_y_distance - first_child.y
          }

        {:big_subtree, []} ->
          mid = (last_child.y + first_child.y) / 2
          %{node | y: mid}

        {:big_subtree, _} ->
          mid = (last_child.y + first_child.y) / 2

          %{
            node
            | y: previous_sibling + @total_y_distance,
              modifier: previous_sibling + @total_y_distance - mid
          }
      end

    if children != [] and top_siblings != [] do
      fix_sibling_conflicts(%{new_node | children: children}, top_siblings)
    else
      %{new_node | children: children}
    end
  end

  defp node_type(node) do
    cond do
      node.type == :leaf -> :leaf
      match?([_], node.children) -> :small_subtree
      true -> :big_subtree
    end
  end

  defp put_final_y_values(%{children: children} = node, mod) do
    new_children = Enum.map(children, &put_final_y_values(&1, node.modifier + mod))

    %{node | y: node.y + mod, children: new_children}
  end

  def fix_sibling_conflicts(node, [top_most_sibling | other_siblings]) do
    top = search_contour({node, %{}, 1, 0}, :top)
    bottom = search_contour({top_most_sibling, %{}, 1, 0}, :bottom)

    distance =
      [Map.values(top), Map.values(bottom)]
      |> Enum.zip()
      |> Enum.reduce(0, fn {t, b}, acc ->
        if t - b + acc < @total_y_distance do
          @total_y_distance - (t - b)
        else
          acc
        end
      end)

    if distance > 0 do
      new_node = %{
        node
        | y: node.y + distance,
          modifier: node.modifier + distance
      }

      fix_sibling_conflicts(new_node, other_siblings)
    else
      fix_sibling_conflicts(node, other_siblings)
    end
  end

  def fix_sibling_conflicts(node, []), do: node

  def search_contour({node, contour, level, mod_sum}, :top) do
    result =
      if Map.has_key?(contour, level) do
        Map.put(contour, level, min(contour[level], node.y + mod_sum))
      else
        Map.put(contour, level, node.y + mod_sum)
      end

    Enum.reduce(
      node.children,
      result,
      &search_contour({&1, &2, level + 1, mod_sum + node.modifier}, :top)
    )
  end

  def search_contour({node, contour, level, mod_sum}, :bottom) do
    result =
      if Map.has_key?(contour, level) do
        Map.put(contour, level, max(contour[level], node.y + mod_sum))
      else
        Map.put(contour, level, node.y + mod_sum)
      end

    Enum.reduce(
      node.children,
      result,
      &search_contour({&1, &2, level + 1, mod_sum + node.modifier}, :bottom)
    )
  end

  defp ensure_children_inside_screen(node) do
    result =
      {node, %{}, 1, 0}
      |> search_contour(:top)
      |> Enum.reduce(0, fn {_, value}, acc ->
        if value + acc < 0, do: value * -1, else: acc
      end)

    %{node | y: node.y + result, modifier: node.modifier + result}
  end

  defp put_x_position(%{children: children} = tree) do
    max_width = find_max_width_by_level(tree, %{})
    children = Enum.map(children, &put_x_position(&1, tree.width + @node_x_separation, max_width))
    %{tree | x: 0, children: children}
  end

  defp put_x_position(%{children: children, level: level} = node, position, max_width) do
    children =
      Enum.map(
        children,
        &put_x_position(&1, max_width[level] + position + @node_x_separation, max_width)
      )

    %{node | x: position, children: children}
  end

  defp find_max_width_by_level(node, max_values) do
    max_values =
      if Map.has_key?(max_values, node.level) do
        Map.put(max_values, node.level, max(max_values[node.level], node.width))
      else
        Map.put(max_values, node.level, node.width)
      end

    Enum.reduce(
      node.children,
      max_values,
      &find_max_width_by_level(&1, &2)
    )
  end

  @doc """
  Returns the tree lines.
  """
  def lines(%{children: children} = node) do
    lines_to_children = lines_to_children(node)

    additional_lines =
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

    children_lines = Enum.flat_map(children, &lines/1)
    lines_to_children ++ additional_lines ++ children_lines
  end

  defp line_from_parent(node, child) do
    %Line{
      x1: node.x + node.width,
      x2: child.x - @node_x_separation / 2,
      y1: node.y + node.height / 2,
      y2: node.y + node.height / 2
    }
  end

  defp vertical_line(%{children: children} = node, child) do
    [top_most_child | _] = children
    [bottom_most_child | _] = Enum.reverse(children)

    %Line{
      x1: child.x - @node_x_separation / 2,
      x2: child.x - @node_x_separation / 2,
      y1: top_most_child.y + node.height / 2,
      y2: bottom_most_child.y + node.height / 2
    }
  end

  defp lines_to_children(%{children: children} = node) do
    Enum.map(children, fn n ->
      %Line{
        x1: n.x - div(@node_x_separation, 2),
        x2: n.x,
        y1: n.y + div(node.height, 2),
        y2: n.y + div(node.height, 2)
      }
    end)
  end
end
