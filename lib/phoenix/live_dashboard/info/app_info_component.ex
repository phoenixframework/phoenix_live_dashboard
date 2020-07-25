defmodule Phoenix.LiveDashboard.AppInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.{SystemInfo, ReingoldTilford}

  @impl true
  def render(assigns) do
    ~L"""
    <div class="app-info">
      <%= if @alive do %>
        <svg width="<%= @width %>" height="<%= @height %>" id="tree" class="tree" >
          <%= for node <- @nodes do %>
            <rect x="<%= node.x %>" y="<%= node.y %>" rx="10" ry="10" width="<%= node.width %>" height="<%= node.height %>"
            class="node" phx-click="show_info" phx-value-info="<%= node_encoded_pid(node.value) %>" phx-page-loading />
            <text class="tree-node-text" x="<%= node.x + 10 %>" y="<%= node.y + div(node.height, 2) %>" dominant-baseline="central">
              <%= node.label %>
            </text>
          <% end %>
          <%= for line <- @lines do %>
            <line x1="<%= line.x1 %>" y1="<%= line.y1 %>" x2="<%= line.x2 %>" y2="<%= line.y2 %>" class="line" />
          <% end %>
        </svg>
      <% else %>
        <div class="app-info-exits mt-1 mb-3">No app or no supervision tree for app exists.</div>
      <% end %>
    </div>
    """
  end

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  @impl true
  def update(%{id: "App<" <> app, path: path, node: node}, socket) do
    app = app |> String.replace_suffix(">", "") |> String.to_existing_atom()
    {:ok, socket |> assign(app: app, path: path, node: node) |> assign_tree()}
  end

  defp assign_tree(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_app_tree(assigns.node, assigns.app) do
      {_, _} = tree ->
        tree = ReingoldTilford.build(tree, &node_label/1)
        nodes = ReingoldTilford.nodes(tree)
        lines = ReingoldTilford.lines(tree)
        {width, height} = ReingoldTilford.dimensions(nodes)
        assign(socket, nodes: nodes, lines: lines, width: width, height: height, alive: true)

      :error ->
        assign(socket, alive: false)
    end
  end

  defp node_encoded_pid({_, pid, _}), do: encode_pid(pid)

  defp node_label({_, pid, []}), do: pid |> :erlang.pid_to_list() |> List.to_string()
  defp node_label({_, _, name}), do: inspect(name)
end
