defmodule Phoenix.LiveDashboard.SupervisionTree do
  # Construct supervision tree given an application master
  @moduledoc false
  alias Phoenix.LiveDashboard.{SystemInfo}

  @node_width 100
  @node_x_separation 50
  @total_x_distance @node_width + @node_x_separation

  def construct_tree(master) do
    {pid, name} = SystemInfo.fetch_application_master_child(master)

    child = get_nodes({name, pid, :supervisor, []}, 2, 0)
    {:ok, [dictionary: dictionary]} = SystemInfo.fetch_process_info(pid, [:dictionary])

    case Keyword.get(dictionary, :"$ancestors") do
      [parent] ->
        %{
          pid: master,
          name: name(master),
          y: 1,
          x: 0,
          children: [
            %{
              pid: parent,
              name: name(parent),
              y: 1,
              x: @total_x_distance,
              children: child,
              modifier: 0,
              num: 0,
              type: :subtree
            }
          ],
          modifier: 0,
          num: 0,
          type: :subtree
        }

      _ ->
        [child]
    end
  end

  def get_nodes({_, :undefined, _, _}, _level, _num), do: []

  def get_nodes({_, pid, :supervisor, _}, level, num) do
    {:ok, [links: links]} = SystemInfo.fetch_process_info(pid, [:links])

    {nodes, _} =
      case Enum.count(links) do
        1 ->
          {[], :some}

        _ ->
          pid
          |> SystemInfo.fetch_supervisor_children()
          |> Kernel.++(Enum.filter(links, fn link -> is_port(link) end))
          |> Enum.reduce({[], 0}, fn x, {acc, num} ->
            {acc ++ get_nodes(x, level + 1, num), num + 1}
          end)
      end

    [
      %{
        pid: pid,
        name: name(pid),
        x: level * @total_x_distance,
        y: 0,
        children: nodes,
        modifier: 0,
        type: if(Enum.empty?(nodes), do: :leaf, else: :subtree),
        num: num
      }
    ]
  end

  def get_nodes({_, pid, :worker, _}, level, num) do
    [
      %{
        pid: pid,
        name: name(pid),
        x: level * @total_x_distance,
        y: 0,
        children: [],
        modifier: 0,
        type: :leaf,
        num: num
      }
    ]
  end

  def get_nodes(port, level, num) when is_port(port) do
    [
      %{
        pid: port,
        name: :port,
        x: level * @total_x_distance,
        y: 0,
        children: [],
        modifier: 0,
        type: :leaf,
        num: num
      }
    ]
  end

  def name(pid) do
    case SystemInfo.fetch_process_info(pid, [:registered_name]) do
      {:ok, [registered_name: []]} -> pid |> inspect |> String.trim_leading("#PID")
      {:ok, [registered_name: name]} -> to_string(name)
    end
  end
end
