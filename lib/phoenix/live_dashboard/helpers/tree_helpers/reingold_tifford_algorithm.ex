defmodule Phoenix.LiveDashboard.ReingoldTilford do
  # Reingold-Tilford algorithm for drawing trees
  @moduledoc false

  @node_height 30
  @node_y_separation 10
  @total_y_distance @node_height + @node_y_separation

  @node_width 120
  @node_x_separation 50
  @total_x_distance @node_width + @node_x_separation

  def set_layout_settings(tree) do
    tree
    |> change_representation(0)
    |> calculate_initial_y(0, [])
    |> ensure_children_inside_screen()
    |> put_final_y_values(0)
  end

  defp change_representation({{_, pid, _}, children}, level) do
    children =
      Enum.reduce(children, [], fn node, acc ->
        [change_representation(node, level + 1) | acc]
      end)

    %{
      pid: pid,
      name: name(pid),
      x: level * @total_x_distance,
      y: 0,
      children: Enum.reverse(children),
      modifier: 0,
      type: if(children == [], do: :leaf, else: :subtree),
      width: @node_width,
      height: @node_height
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
        [first_child | _] = children
        [last_child | _] = Enum.reverse(children)
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
          if node_type(first_child) == :big_subtree do
            %{
              node
              | y: previous_sibling + @total_y_distance,
                modifier: previous_sibling + first_child.y - first_child.modifier
            }
          else
            %{
              node
              | y: previous_sibling + @total_y_distance,
                modifier:
                  previous_sibling + @total_y_distance + first_child.y - first_child.modifier
            }
          end

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

  defp name(pid) do
    case :erlang.process_info(pid, :registered_name) do
      {_, registered_name} -> to_string(registered_name)
      _ -> pid |> inspect |> String.trim_leading("#PID")
    end
  end
end
