defmodule Phoenix.LiveDashboard.ReingoldTilfordTest do
  use ExUnit.Case, async: true
  use PropCheck

  # Properties
  property "If one node has children it's y position is the middle point else its child y" do
    forall tree <- limited_tree() do
      tree
      |> Phoenix.LiveDashboard.ReingoldTilford.set_layout_settings(& &1)
      |> ensure_mid_position()
    end
  end

  # Helpers
  def ensure_mid_position(%{children: []}), do: true

  def ensure_mid_position(%{children: [child]} = node) do
    if node.y == child.y do
      ensure_mid_position(child)
    else
      false
    end
  end

  def ensure_mid_position(%{children: [first_child | _] = children} = node) do
    [last_child | _] = Enum.reverse(children)
    if node.y == (first_child.y + last_child.y) / 2 do
      result =
      children
      |> Enum.map(&ensure_mid_position(&1))
      |> Enum.uniq()
      case result do
        [_] -> true
        _ -> false
      end
    else
      false
    end
  end


  def put_name(name) do
    name
  end
  # Generators

  def limited_tree() do
    sized(size, limited_tree(choose(20, 50), size))
  end

  def limited_tree(type, size) when size <= 1, do: {type, []}

  def limited_tree(type, size) do
    {type,
     lazy(
       list(
         frequency([
           {1, {type, []}},
           {60, {type, [limited_tree(type , div(size, 4))]}}
         ])
       )
     )}
  end
end
