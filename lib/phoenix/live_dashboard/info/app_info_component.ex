defmodule Phoenix.LiveDashboard.AppInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.{SystemInfo, TreeDrawingHelpers, ReingoldTilford}

  @impl true
  def render(assigns) do
    ~L"""
    <div class="app-info">
      <%= if @alive do %>
        <svg width="<%= @width %>" height="<%= @height %>" id="tree" class="tree" >
          <%= for node <- @nodes, pid = encode_pid(node.pid) do %>
            <rect x="<%= node.x %>" y="<%= node.y %>" rx="20" ry="20" width="<%= node.width %>" height="<%= node.height %>"
            class="node" phx-click="show_info" phx-value-pid="<%= pid %>" phx-target=<%= @myself %> phx-page-loading />
            <text class="tree-node-text" x="<%= node.x + 5 %>" y="<%= node.y + node.height *0.6%>">
              <%= node.name %>
            </text>
          <% end %>
          #<%= for line <- @lines do %>
            <line x1="<%= line.x1 %>" y1="<%= line.y1 %>" x2="<%= line.x2 %>" y2="<%= line.y2 %>" class="line" />
          #<% end %>
        </svg>
      <% else %>
        <div class="app-info-exits mt-1 mb-3">No app or no supervision tree for app exists.</div>
      <% end %>
    </div>
    """
  end

  @impl true
  def mount(socket) do
    {:ok, assign(socket, width: 500, height: 500, nodes: [], lines: [])}
  end

  @impl true
  def update(%{id: "App<" <> app, path: path, node: node}, socket) do
    app = app |> String.replace_suffix(">", "") |> String.to_existing_atom()
    {:ok, socket |> assign(app: app, path: path, node: node) |> assign_tree()}
  end

  @impl true
  def handle_event("show_info", %{"pid" => pid}, socket) do
    {:noreply, push_patch(socket, to: socket.assigns.path.(socket.assigns.node, info: pid))}
  end

  defp assign_tree(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_app_tree(assigns.node, assigns.app) do
      {_, _} = tree ->
        tree = ReingoldTilford.set_layout_settings(tree, &name_length/1)
        nodes = TreeDrawingHelpers.extract_nodes(tree)
        {width, height} = TreeDrawingHelpers.svg_size(nodes)

        assign(socket,
          nodes: nodes,
          lines: TreeDrawingHelpers.extract_lines(tree),
          width: width,
          height: height,
          alive: true
        )

      :error ->
        assign(socket, alive: false)
    end
  end

  defp name_length({_, pid, name}) do
    name =
      if name == [] do
        pid |> inspect() |> String.trim_leading("#PID")
      else
        inspect(name)
      end

    String.length(name) * 10
  end
end
