defmodule Phoenix.LiveDashboard.AppInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.{PageBuilder, SystemInfo, ReingoldTilford}

  @impl true
  def render(assigns) do
    ~H"""
    <div class="app-info">
      <%= if @alive do %>
        <PageBuilder.live_nav_bar
          id="app-info-nav"
          page={@page}
          nav_param="view_mode"
          extra_params={["info"]}
        >
          <:item name="tree" label="Tree"></:item>
          <:item name="list" label="List"></:item>
        </PageBuilder.live_nav_bar>

        <%= if @view_mode == :tree do %>
          <svg width={@width} height={@height} id="tree" class="tree">
            <%= for node <- @nodes do %>
              <rect
                x={node.x}
                y={node.y}
                rx="10"
                ry="10"
                width={node.width}
                height={node.height}
                class="node"
                phx-click="show_info"
                phx-value-info={node_encoded_pid(node.value)}
                phx-page-loading
              />
              <text
                class="tree-node-text"
                x={node.x + 10}
                y={node.y + div(node.height, 2)}
                dominant-baseline="central"
              >
                <%= node.label %>
              </text>
            <% end %>
            <%= for line <- @lines do %>
              <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} class="line" />
            <% end %>
          </svg>
        <% else %>
          <div class="app-info-actions">
            <form phx-change="filter" phx-submit="filter" phx-target={@myself} class="app-info-filter">
              <input
                type="search"
                name="filter"
                class="app-info-filter-input"
                value={@filter}
                placeholder="Search"
                phx-debounce="150"
              />
            </form>
            <button class="app-info-action-btn" phx-click="expand_all" phx-target={@myself}>
              Expand all
            </button>
            <button class="app-info-action-btn" phx-click="collapse_all" phx-target={@myself}>
              Collapse all
            </button>
          </div>
          <div class="app-info-list">
            <.list_tree
              nodes={@filtered_tree}
              collapsed={@collapsed}
              myself={@myself}
              filter={@filter}
            />
          </div>
        <% end %>
      <% else %>
        <div class="app-info-exits mt-1 mb-3">No app or no supervision tree for app exists.</div>
      <% end %>
    </div>
    """
  end

  defp list_tree(assigns) do
    ~H"""
    <ul class="process-list">
      <li :for={{node_value, children} <- @nodes} class="process-list-item">
        <div class={
          "process-list-row" <>
            if(node_matches?(node_value, @filter), do: " process-list-match", else: "")
        }>
          <%= if children != [] do %>
            <span
              class="process-list-toggle"
              phx-click="toggle_collapse"
              phx-value-pid={encode_pid_string(node_value)}
              phx-target={@myself}
            >
              <%= if MapSet.member?(@collapsed, encode_pid_string(node_value)), do: "▸", else: "▾" %>
            </span>
          <% else %>
            <span class="process-list-toggle-placeholder"></span>
          <% end %>
          <span class={"process-list-type process-list-type--#{node_type(node_value)}"}>
            <%= node_type(node_value) %>
          </span>
          <span
            class="process-list-name"
            phx-click="show_info"
            phx-value-info={node_encoded_pid(node_value)}
            phx-page-loading
          >
            <%= node_label(node_value) %>
          </span>
        </div>
        <%= unless children == [] or MapSet.member?(@collapsed, encode_pid_string(node_value)) do %>
          <.list_tree nodes={children} collapsed={@collapsed} myself={@myself} filter={@filter} />
        <% end %>
      </li>
    </ul>
    """
  end

  @impl true
  def mount(socket) do
    {:ok, assign(socket, collapsed: MapSet.new(), filter: "")}
  end

  @impl true
  def update(%{id: "App<" <> app, page: page}, socket) do
    app = app |> String.replace_suffix(">", "") |> String.to_existing_atom()
    view_mode = if page.params["view_mode"] == "list", do: :list, else: :tree

    {:ok,
     socket
     |> assign(app: app, node: page.node, page: page, view_mode: view_mode)
     |> assign_tree()}
  end

  @impl true
  def handle_event("toggle_collapse", %{"pid" => pid_string}, socket) do
    collapsed = socket.assigns.collapsed

    collapsed =
      if MapSet.member?(collapsed, pid_string),
        do: MapSet.delete(collapsed, pid_string),
        else: MapSet.put(collapsed, pid_string)

    {:noreply, assign(socket, collapsed: collapsed)}
  end

  @impl true
  def handle_event("expand_all", _, socket) do
    {:noreply, assign(socket, collapsed: MapSet.new())}
  end

  @impl true
  def handle_event("collapse_all", _, socket) do
    all_supervisors = collect_supervisor_pids(socket.assigns.raw_tree)
    {:noreply, assign(socket, collapsed: all_supervisors)}
  end

  @impl true
  def handle_event("filter", %{"filter" => filter}, socket) do
    filtered_tree = filter_tree(socket.assigns.raw_tree, filter)
    {:noreply, assign(socket, filter: filter, filtered_tree: filtered_tree)}
  end

  defp collect_supervisor_pids(nodes) do
    Enum.reduce(nodes, MapSet.new(), fn {node_value, children}, acc ->
      if children != [] do
        acc
        |> MapSet.put(encode_pid_string(node_value))
        |> MapSet.union(collect_supervisor_pids(children))
      else
        acc
      end
    end)
  end

  defp filter_tree(nodes, filter) when filter in ["", nil], do: nodes

  defp filter_tree(nodes, filter) do
    downcased = String.downcase(filter)

    Enum.reduce(nodes, [], fn {node_value, children}, acc ->
      filtered_children = filter_tree(children, filter)
      label = node_label(node_value) |> to_string() |> String.downcase()
      type = node_type(node_value) |> to_string()

      if String.contains?(label, downcased) or String.contains?(type, downcased) or
           filtered_children != [] do
        [{node_value, filtered_children} | acc]
      else
        acc
      end
    end)
    |> Enum.reverse()
  end

  defp assign_tree(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_app_tree(assigns.node, assigns.app) do
      {_, _} = raw_tree ->
        tree = ReingoldTilford.build(raw_tree, &node_label/1)
        nodes = ReingoldTilford.nodes(tree)
        lines = ReingoldTilford.lines(tree)
        {width, height} = ReingoldTilford.dimensions(nodes)

        # Wrap the raw tree root into the same [{node_value, children}] shape
        {root_value, children} = raw_tree
        list_tree = [{root_value, children}]

        filtered_tree =
          if list_tree == assigns[:raw_tree],
            do: assigns[:filtered_tree] || list_tree,
            else: filter_tree(list_tree, assigns[:filter])

        assign(socket,
          nodes: nodes,
          lines: lines,
          width: width,
          height: height,
          raw_tree: list_tree,
          filtered_tree: filtered_tree,
          alive: true
        )

      :error ->
        assign(socket, alive: false)
    end
  end

  defp node_encoded_pid({_, pid, _}), do: PageBuilder.encode_pid(pid)

  defp encode_pid_string({_, pid, _}), do: pid |> :erlang.pid_to_list() |> List.to_string()

  defp node_type({type, _, _}), do: type

  defp node_matches?(_node_value, filter) when filter in ["", nil], do: false

  defp node_matches?(node_value, filter) do
    downcased = String.downcase(filter)
    label = node_label(node_value) |> to_string() |> String.downcase()
    type = node_type(node_value) |> to_string()
    String.contains?(label, downcased) or String.contains?(type, downcased)
  end

  defp node_label({_, pid, []}), do: pid |> :erlang.pid_to_list() |> List.to_string()
  defp node_label({_, _, name}), do: inspect(name)
end
