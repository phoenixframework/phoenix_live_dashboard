defmodule Phoenix.LiveDashboard.ReingoldTilford do
  # Reingold-Tilford algorithm for drawing trees
  @moduledoc false

  @height 20
  @node_y_separation 10
  @total_y_distance @height + @node_y_separation

  def set_layout_settings(tree) do
    tree
    |> calculate_initial_y(0, [])
    |> ensure_children_inside_screen()
    |> put_final_y_values(0)
  end

  defp calculate_initial_y(%{children: children} = node, previous_sibling, top_siblings) do
    {_, children} =
      children
      |> Enum.reduce({0, []}, fn n, {prev_sibling, nodes} ->
        new_node = calculate_initial_y(n, prev_sibling, nodes)
        {new_node.y, nodes ++ [new_node]}
      end)

    new_node =
      case {node_type(node), node.num} do
        {:leaf, 0} ->
          %{node | y: 0}

        {:leaf, _} ->
          %{node | y: previous_sibling + @total_y_distance}

        {:small_subtree, 0} ->
          child = Enum.min_by(children, & &1.y)

          %{node | y: child.y}

        {:small_subtree, _} ->
          %{
            node
            | y: previous_sibling + @total_y_distance,
              modifier: previous_sibling + @total_y_distance + hd(children).y
          }

        {:big_subtree, 0} ->
          mid = (List.last(children).y + hd(children).y) / 2
          %{node | y: mid}

        {:big_subtree, _} ->
          mid = (List.last(children).y + hd(children).y) / 2

          %{
            node
            | y: previous_sibling + @total_y_distance,
              modifier: previous_sibling + @total_y_distance - mid
          }
      end

    if !Enum.empty?(children) and !Enum.empty?(top_siblings) do
      fix_sibling_conflicts(%{new_node | children: children}, top_siblings)
    else
      %{new_node | children: children}
    end
  end

  defp node_type(node) do
    with :subtree <- node.type,
         1 <- Enum.count(node.children) do
      :small_subtree
    else
      :leaf -> :leaf
      _ -> :big_subtree
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
      Map.merge(top, bottom, fn _, c1, c2 -> c1 - c2 end)
      |> Enum.reduce(0, fn {_b, t}, acc ->
        if t + acc < @total_y_distance and acc < @total_y_distance - t do
          @total_y_distance - t
        else
          acc
        end
      end)

    if distance > 0 do
      new_node = %{
        node
        | y: node.y + distance + @node_y_separation,
          modifier: node.modifier + distance + @node_y_separation
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
end
