defmodule Phoenix.LiveDashboard.ReingoldTilfordTest do
  use ExUnit.Case, async: true
  use ExUnitProperties

  # Same values on reingold_tilford_algorithm.ex
  @node_height 30
  @node_y_separation 10
  @total_y_distance @node_height + @node_y_separation
  @node_x_separation 50

  # Properties
  property "if a node has only one child its Y coordinate is the same Y coordinate of its child" do
    check all(tree <- tree()) do
      result =
        tree
        |> Phoenix.LiveDashboard.ReingoldTilford.build(&label/1)
        |> validate_nodes_with_one_child_y_coordinate()

      assert result == true
    end
  end

  property "if a node has more than one child, its Y coordinate is the middle point between the first and last child" do
    check all(tree <- tree()) do
      result =
        tree
        |> Phoenix.LiveDashboard.ReingoldTilford.build(&label/1)
        |> validate_node_y_coordinate_based_on_its_children()

      assert result == true
    end
  end

  property "all nodes at the same deep level have the same X coordinate" do
    check all(tree <- tree()) do
      result =
        tree
        |> Phoenix.LiveDashboard.ReingoldTilford.build(&label/1)
        |> validate_x_coordinate_by_level(%{})

      assert result == true
    end
  end

  property "all children must be at least @node_x_separation separation from its ancestor" do
    check all(tree <- tree()) do
      ancestor = @node_x_separation * -1

      result =
        tree
        |> Phoenix.LiveDashboard.ReingoldTilford.build(&label/1)
        |> validate_x_separation_between_nodes(ancestor)

      assert result == true
    end
  end

  property "all nodes at the same deep level have to be at least @node_y_separation from each other" do
    check all(tree <- tree()) do
      result =
        tree
        |> Phoenix.LiveDashboard.ReingoldTilford.build(&label/1)
        |> validate_y_separation_between_nodes()

      assert result == true
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

  defp label(length), do: String.duplicate("a", length)

  # Generator

  def tree() do
    StreamData.sized(fn size -> tree_gen(StreamData.integer(20..50), size) end)
  end

  defp tree_gen(type, size) when size <= 1 do
    StreamData.tuple({type, StreamData.list_of(StreamData.tuple({}), length: 0)})
  end

  defp tree_gen(type, size) do
    StreamData.tuple(
      {type,
       StreamData.nonempty(StreamData.list_of(tree_gen(type, div(size, 4)), max_length: 10))}
    )
  end
end
