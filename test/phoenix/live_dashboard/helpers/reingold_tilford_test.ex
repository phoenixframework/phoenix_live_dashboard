defmodule Phoenix.LiveDashboard.ReingoldTilfordTest do
  use ExUnit.Case, async: true
  use PropCheck

  # Same values on reingold_tilford_algorithm.ex
  @node_height 30
  @node_y_separation 10
  @total_y_distance @node_height + @node_y_separation
  @node_x_separation 50

  # Properties
  property "If a node has only one child its Y coordinate is the same Y coordinate of its child" do
    forall tree <- tree() do
      tree
      |> Phoenix.LiveDashboard.ReingoldTilford.set_layout_settings(& &1)
      |> validate_nodes_with_one_child_y_coordinate()
    end
  end

  property "If a node has more than one child, its Y coordinate is the middle point between the first and last child" do
    forall tree <- tree() do
      tree
      |> Phoenix.LiveDashboard.ReingoldTilford.set_layout_settings(& &1)
      |> validate_node_y_coordinate_based_on_its_children()
    end
  end

  property "All nodes at the same deep level have the same X coordinate" do
    forall tree <- tree() do
      tree
      |> Phoenix.LiveDashboard.ReingoldTilford.set_layout_settings(& &1)
      |> validate_x_coordinate_by_level(%{})
    end
  end

  property "All children must be at least @node_x_separation separation from its ancestor " do
    forall tree <- tree() do
      ancestor = @node_x_separation * -1

      tree
      |> Phoenix.LiveDashboard.ReingoldTilford.set_layout_settings(& &1)
      |> validate_x_separation_between_nodes(ancestor)
    end
  end

  property "All nodes at the same deep level have to be at least @node_y_separation from each other" do
    forall tree <- tree() do
      tree
      |> Phoenix.LiveDashboard.ReingoldTilford.set_layout_settings(& &1)
      |> validate_y_separation_between_nodes()
    end
  end

  # Helpers
  defp validate_nodes_with_one_child_y_coordinate(%{children: []}), do: true

  defp validate_nodes_with_one_child_y_coordinate(%{children: [child]} = node) do
    if node.y == child.y, do: validate_nodes_with_one_child_y_coordinate(child), else: false
  end

  defp validate_nodes_with_one_child_y_coordinate(%{children: children}) do
    children
    |> Enum.reduce_while(true, fn node, _acc ->
      if validate_nodes_with_one_child_y_coordinate(node), do: {:cont, true}, else: {:halt, false}
    end)
  end

  defp validate_node_y_coordinate_based_on_its_children(%{children: []}), do: true

  defp validate_node_y_coordinate_based_on_its_children(%{children: [child]}) do
    validate_node_y_coordinate_based_on_its_children(child)
  end

  defp validate_node_y_coordinate_based_on_its_children(%{children: children} = node) do
    [first_child | _] = children
    [last_child | _] = Enum.reverse(children)

    if node.y == (first_child.y + last_child.y) / 2 do
      children
      |> Enum.reduce_while(true, fn node, _acc ->
        if validate_node_y_coordinate_based_on_its_children(node),
          do: {:cont, true},
          else: {:halt, false}
      end)
    else
      false
    end
  end

  defp validate_x_coordinate_by_level(%{children: []} = node, accumulator) do
    accumulator = update_accumulator(accumulator, node)
    if accumulator[node.level] == node.y, do: true, else: false
  end

  defp validate_x_coordinate_by_level(%{children: children} = node, accumulator) do
    accumulator = update_accumulator(accumulator, node)

    if accumulator[node.level] == node.y do
      children
      |> Enum.reduce_while(true, fn node, _acc ->
        if validate_x_coordinate_by_level(node, accumulator),
          do: {:cont, true},
          else: {:halt, false}
      end)
    else
      false
    end
  end

  defp update_accumulator(accumulator, node) do
    if Map.has_key?(accumulator, node.level) do
      accumulator
    else
      Map.put(accumulator, node.level, node.y)
    end
  end

  defp validate_x_separation_between_nodes(%{children: []} = node, ancestor_x_coordinate) do
    if ancestor_x_coordinate + @node_x_separation <= node, do: true, else: false
  end

  defp validate_x_separation_between_nodes(
         %{children: children} = ancestor,
         ancestor_x_coordinate
       ) do
    if ancestor_x_coordinate + @node_x_separation <= ancestor.x do
      children
      |> Enum.reduce_while(true, fn node, _acc ->
        if validate_x_separation_between_nodes(node, ancestor.x),
          do: {:cont, true},
          else: {:halt, false}
      end)
    else
      false
    end
  end

  defp validate_y_separation_between_nodes(tree) do
    tree
    |> nodes_by_level(%{})
    |> Enum.reduce_while(true, fn {_level, nodes}, _acc ->
      if level_has_conflicts?(nodes), do: {:halt, false}, else: {:cont, true}
    end)
  end

  defp level_has_conflicts?(nodes) do
    {result, _} =
      nodes
      |> Enum.sort()
      |> Enum.reduce_while({true, -@total_y_distance}, fn x, {_, acc} ->
        if acc + @total_y_distance <= x, do: {:cont, {false, x}}, else: {:halt, {true, x}}
      end)

    result
  end

  defp nodes_by_level(%{children: []} = node, accumulator) do
    if Map.has_key?(accumulator, node.level) do
      Map.put(accumulator, node.level, [node.y | accumulator[node.level]])
    else
      Map.put(accumulator, node.level, [node.y])
    end
  end

  defp nodes_by_level(%{children: children} = node, accumulator) do
    accumulator =
      if Map.has_key?(accumulator, node.level) do
        Map.put(accumulator, node.level, [node.y | accumulator[node.level]])
      else
        Map.put(accumulator, node.level, [node.y])
      end

    Enum.reduce(children, accumulator, &nodes_by_level(&1, &2))
  end

  # Generators
  defp tree() do
    sized(size, tree(choose(20, 50), size))
  end

  defp tree(type, size) when size <= 1, do: {type, []}

  defp tree(type, size) do
    {type, lazy(non_empty(list(tree(type, div(size, 3)))))}
  end
end
