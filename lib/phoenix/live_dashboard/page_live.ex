defmodule Phoenix.LiveDashboard.PageNotFound do
  @moduledoc false
  defexception [:message, plug_status: 404]
end

defmodule Phoenix.LiveDashboard.PageLive do
  @moduledoc false
  use Phoenix.LiveDashboard.Web, :live_view

  import Phoenix.LiveDashboard.Helpers
  alias Phoenix.LiveView.Socket
  alias Phoenix.LiveDashboard.PageBuilder
  alias __MODULE__

  @derive {Inspect, only: []}
  @default_refresh 15
  @refresh_options [1, 2, 5, 15, 30]
  defstruct links: [],
            nodes: [],
            dashboard_mount_path: nil,
            refresher?: true,
            refresh: @default_refresh,
            refresh_options: for(i <- @refresh_options, do: {"#{i}s", i}),
            timer: nil

  @impl true
  def mount(%{"page" => page} = params, %{"pages" => pages} = session, socket) do
    case Enum.find(pages, :error, fn {key, _} -> Atom.to_string(key) == page end) do
      {_id, {module, page_session}} ->
        assign_mount(socket, module, pages, page_session, params, session)

      :error ->
        raise Phoenix.LiveDashboard.PageNotFound, "unknown page #{inspect(page)}"
    end
  end

  def mount(_params, _session, socket) do
    {:ok, redirect_to_current_node(socket)}
  end

  defp assign_mount(socket, module, pages, page_session, params, session) do
    %{
      "requirements" => requirements,
      "allow_destructive_actions" => allow_destructive_actions,
      "csp_nonces" => csp_nonces
    } = session

    page = %PageBuilder{module: module, allow_destructive_actions: allow_destructive_actions}
    socket = assign(socket, page: page, menu: %PageLive{}, csp_nonces: csp_nonces)

    with %Socket{redirected: nil} = socket <- assign_params(socket, params),
         %Socket{redirected: nil} = socket <- assign_node(socket, params),
         %Socket{redirected: nil} = socket <- assign_refresh(socket),
         %Socket{redirected: nil} = socket <- assign_menu_links(socket, pages, requirements) do
      socket
      |> init_schedule_refresh()
      |> maybe_apply_module(:mount, [params, page_session], &{:ok, &1})
    else
      %Socket{} = redirected_socket -> {:ok, redirected_socket}
    end
  end

  defp assign_params(socket, params) do
    update_page(socket, params: params, info: params["info"], route: route(params))
  end

  defp route(%{"page" => page}), do: String.to_existing_atom(page)

  defp assign_node(socket, params) do
    found_node =
      if param_node = params["node"] do
        Enum.find(nodes(), &(Atom.to_string(&1) == param_node))
      else
        node()
      end

    if found_node do
      if connected?(socket) do
        :net_kernel.monitor_nodes(true, node_type: :all)
      end

      socket
      |> update_page(node: found_node)
      |> update_menu(nodes: nodes())
    else
      redirect_to_current_node(socket)
    end
  end

  defp assign_refresh(socket) do
    module = socket.assigns.page.module

    refresh = get_stored_refresh(socket)
    update_menu(socket, refresh: refresh, refresher?: module.__page_live__(:refresher?))
  end

  defp get_stored_refresh(socket) do
    key = Atom.to_string(socket.assigns.page.route)
    refresh = get_connect_params(socket)["refresh_data"][key]

    with false <- is_nil(refresh),
         {refresh, ""} <- Integer.parse(refresh),
         true <- refresh in @refresh_options do
      refresh
    else
      _ -> @default_refresh
    end
  end

  defp init_schedule_refresh(socket) do
    if connected?(socket) and socket.assigns.menu.refresher? do
      schedule_refresh(socket)
    else
      socket
    end
  end

  defp schedule_refresh(socket) do
    update_menu(socket,
      timer: Process.send_after(self(), :refresh, socket.assigns.menu.refresh * 1000)
    )
  end

  defp assign_menu_links(socket, pages, requirements) do
    node = socket.assigns.page.node
    capabilities = Phoenix.LiveDashboard.SystemInfo.node_capabilities(node, requirements)
    current_route = socket.assigns.page.route |> Atom.to_string()

    {links, socket} =
      Enum.map_reduce(pages, socket, fn {route, {module, session}}, socket ->
        current? = Atom.to_string(route) == current_route
        menu_link = module.menu_link(session, capabilities)

        case {current?, menu_link} do
          {true, {:ok, anchor}} ->
            {{:current, anchor}, socket}

          {true, _} ->
            {:skip, redirect_to_current_node(socket)}

          {false, {:ok, anchor}} ->
            {{:enabled, anchor, route}, socket}

          {false, :skip} ->
            {:skip, socket}

          {false, {:disabled, anchor}} ->
            {{:disabled, anchor}, socket}

          {false, {:disabled, anchor, more_info_url}} ->
            {{:disabled, anchor, more_info_url}, socket}
        end
      end)

    update_menu(socket, links: links)
  end

  defp maybe_apply_module(socket, fun, params, default) do
    if function_exported?(socket.assigns.page.module, fun, length(params) + 1) do
      apply(socket.assigns.page.module, fun, params ++ [socket])
    else
      default.(socket)
    end
  end

  @impl true
  def handle_params(params, url, socket) do
    socket =
      socket
      |> assign_params(params)
      |> dashboard_mount_path(url, params)

    maybe_apply_module(socket, :handle_params, [params, url], &{:noreply, &1})
  end

  defp dashboard_mount_path(socket, url, params) do
    %{path: path} = URI.parse(url)
    range = if params["node"], do: 0..-3, else: 0..-2

    mount_path = path |> String.split("/", trim: true) |> Enum.slice(range) |> Enum.join("/")
    mount_path = "/" <> mount_path

    update_menu(socket, dashboard_mount_path: mount_path)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <header class="d-flex">
      <div id="menu" class="container d-flex flex-column">
        <h1>Phoenix LiveDashboard</h1>

        <div id="nav-dropdowns">
          <form id="refresher" phx-change="select_refresh">
            <%= if @menu.refresher? do %>
              <label for="refresh-interval-select">Update every</label>
              <select name="refresh" class="custom-select custom-select-sm"
                      id="refresh-interval-select" data-page={@page.route}
                      data-dashboard-mount-path={@menu.dashboard_mount_path}
                      phx-hook="PhxRememberRefresh">
                <%= options_for_select(@menu.refresh_options, @menu.refresh) %>
              </select>
            <% else %>
              <label class="no-select">Updates automatically</label>
            <% end %>
          </form>

          <form id="node-selection" phx-change="select_node" phx-auto-recover="ignore">
            <label for="node-select">Selected node</label>
            <select name="node" class="custom-select custom-select-sm" id="node-select">
              <%= options_for_select(@menu.nodes, @page.node) %>
            </select>
          </form>
        </div>

        <nav id="menu-bar">
          <%= for link <- @menu.links, link != :skip do %>
            <%= maybe_link(@socket, @page, link) %>
          <% end %>
        </nav>
      </div>
    </header>
    <%= live_info(@socket, @page) %>
    <section id="main" role="main" class="container">
      <%= render_page(@page.module, assigns) %>
    </section>
    """
  end

  # Those pages are handled especially outside of the component tree.
  defp render_page(module, assigns)
       when module in [Phoenix.LiveDashboard.RequestLoggerPage] do
    module.render(assigns)
  end

  defp render_page(module, assigns) do
    {component, component_assigns} = module.render_page(assigns)
    component_assigns = Map.put(component_assigns, :page, assigns.page)
    live_component(component, component_assigns)
  end

  defp live_info(_, %{info: nil}), do: nil

  defp live_info(socket, %{info: title, node: node, params: params} = page) do
    if component = extract_info_component(title) do
      params = Map.delete(params, "info")

      path =
        &PageBuilder.live_dashboard_path(socket, page.route, &1, params, Enum.into(&2, params))

      live_modal(component,
        id: title,
        return_to: path.(node, []),
        title: title,
        path: path,
        page: page,
        node: node
      )
    end
  end

  defp live_modal(component, opts) do
    path = Keyword.fetch!(opts, :return_to)
    title = Keyword.fetch!(opts, :title)
    modal_opts = [id: :modal, return_to: path, component: component, opts: opts, title: title]
    live_component(Phoenix.LiveDashboard.ModalComponent, modal_opts)
  end

  defp extract_info_component("PID<" <> _), do: Phoenix.LiveDashboard.ProcessInfoComponent
  defp extract_info_component("Port<" <> _), do: Phoenix.LiveDashboard.PortInfoComponent
  defp extract_info_component("Socket<" <> _), do: Phoenix.LiveDashboard.SocketInfoComponent
  defp extract_info_component("ETS<" <> _), do: Phoenix.LiveDashboard.EtsInfoComponent
  defp extract_info_component("App<" <> _), do: Phoenix.LiveDashboard.AppInfoComponent
  defp extract_info_component(_), do: nil

  @impl true
  def handle_info({:nodeup, _, _}, socket) do
    {:noreply, assign(socket, nodes: nodes())}
  end

  def handle_info({:nodedown, _, _}, socket) do
    {:noreply, validate_nodes_or_redirect(socket)}
  end

  def handle_info(:refresh, socket) do
    socket
    |> update(:page, fn page -> %{page | tick: page.tick + 1} end)
    |> schedule_refresh()
    |> maybe_apply_module(:handle_refresh, [], &{:noreply, &1})
  end

  def handle_info(message, socket) do
    maybe_apply_module(socket, :handle_info, [message], &{:noreply, &1})
  end

  @impl true
  def handle_event("select_node", %{"node" => param_node}, socket) do
    node = Enum.find(nodes(), &(Atom.to_string(&1) == param_node))

    page = socket.assigns.page

    if node && node != page.node do
      to = PageBuilder.live_dashboard_path(socket, page.route, node, page.params, page.params)
      {:noreply, push_redirect(socket, to: to)}
    else
      {:noreply, redirect_to_current_node(socket)}
    end
  end

  def handle_event("select_refresh", params, socket) do
    case Integer.parse(params["refresh"]) do
      {refresh, ""} -> {:noreply, update_menu(socket, refresh: refresh)}
      _ -> {:noreply, socket}
    end
  end

  def handle_event("show_info", %{"info" => info}, socket) do
    to = PageBuilder.live_dashboard_path(socket, socket.assigns.page, info: info)
    {:noreply, push_patch(socket, to: to)}
  end

  def handle_event(event, params, socket) do
    socket.assigns.page.module.handle_event(event, params, socket)
  end

  ## Navbar handling

  defp maybe_link(_socket, _page, {:current, text}) do
    assigns = %{text: text}

    ~H"""
    <div class="menu-item active"><%= text %></div>
    """
  end

  defp maybe_link(socket, page, {:enabled, text, route}) do
    live_redirect(text,
      to: PageBuilder.live_dashboard_path(socket, route, page.node, page.params, []),
      class: "menu-item"
    )
  end

  defp maybe_link(_socket, _page, {:disabled, text}) do
    assigns = %{text: text}

    ~H"""
    <div class="menu-item menu-item-disabled">
      <%= @text %>
    </div>
    """
  end

  defp maybe_link(_socket, _page, {:disabled, text, more_info_url}) do
    assigns = %{more_info_url: more_info_url, text: text}

    ~H"""
    <div class="menu-item menu-item-disabled">
      <%= @text %> <%= link "Enable", to: @more_info_url, class: "menu-item-enable-button" %>
    </div>
    """
  end

  ## Node helpers

  defp validate_nodes_or_redirect(socket) do
    if socket.assigns.page.node not in nodes() do
      socket
      |> put_flash(:error, "Node #{socket.assigns.page.node} disconnected.")
      |> redirect_to_current_node()
    else
      assign(socket, nodes: nodes())
    end
  end

  defp redirect_to_current_node(socket) do
    push_redirect(socket, to: PageBuilder.live_dashboard_path(socket, :home, node(), %{}, %{}))
  end

  defp update_page(socket, assigns) do
    update(socket, :page, fn page ->
      Enum.reduce(assigns, page, fn {key, value}, page ->
        Map.replace!(page, key, value)
      end)
    end)
  end

  defp update_menu(socket, assigns) do
    update(socket, :menu, fn page ->
      Enum.reduce(assigns, page, fn {key, value}, page ->
        Map.replace!(page, key, value)
      end)
    end)
  end
end
