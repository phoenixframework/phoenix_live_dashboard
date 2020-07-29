defmodule Phoenix.LiveDashboard.MenuLive do
  # TODO Rename to component
  use Phoenix.LiveDashboard.Web, :live_component

  # @default_refresh 5
  # @supported_refresh [{"1s", 1}, {"2s", 2}, {"5s", 5}, {"15s", 15}, {"30s", 30}]

  # @impl true
  # def mount(_, %{"menu" => menu}, socket) do
  #   socket = assign(socket, menu: menu, node: menu.node, refresh: @default_refresh)

  #   {:ok, socket}
  # end

  @impl true
  def update(%{page: page}, socket) do
    {:ok, assign(socket, page: page)}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div id="menu">
      <nav id="menu-bar">
        <%= maybe_active_live_redirect @socket, @page, "Home", :home %>
        <%= maybe_enabled_live_redirect @socket, @page, "OS Data", :os_mon %>
        <%= if @page.dashboard_running? do %>
          <%= maybe_enabled_live_redirect @socket, @page, "Metrics", :metrics %>
          <%= maybe_enabled_live_redirect @socket, @page, "Request Logger", :request_logger %>
        <% end %>
        <%= maybe_active_live_redirect @socket, @page, "Applications", :applications %>
        <%= maybe_active_live_redirect @socket, @page, "Processes", :processes %>
        <%= maybe_active_live_redirect @socket, @page, "Ports", :ports %>
        <%= maybe_active_live_redirect @socket, @page, "Sockets", :sockets %>
        <%= maybe_active_live_redirect @socket, @page, "ETS", :ets %>
      </nav>

      <form id="node-selection" phx-change="select_node" class="d-inline">
        <div class="input-group input-group-sm d-flex flex-column">
          <div class="input-group-prepend">
            <label class="input-group-text" for="node-select">Selected node:</label>
          </div>
          <select name="node" class="custom-select" id="node-select">
            <%= options_for_select(@page.nodes, @page.node) %>
          </select>
        </div>
      </form>

      <div id="refresher">
        <form phx-change="select_refresh">
          <div class="input-group input-group-sm">
            <%= if @page.refresher? do %>
              <div class="input-group-prepend">
                <label class="input-group-text" for="refresh-interval-select">Update every</label>
              </div>
              <select name="refresh" class="custom-select" id="refresh-interval-select">
                <%= options_for_select(@page.refresh_options, @page.refresh) %>
              </select>
            <% else %>
              <div class="input-group-prepend">
                <small class="input-group-text text-muted">Updates automatically</small>
              </div>
            <% end %>
          </div>
        </form>
      </div>
    </div>
    """
  end

  defp maybe_active_live_redirect(socket, page, text, route) do
    if page.route == route do
      content_tag(:div, text, class: "menu-item active")
    else
      live_redirect(text,
        to: live_dashboard_path(socket, route, page.node, []),
        class: "menu-item"
      )
    end
  end

  defp maybe_enabled_live_redirect(socket, page, text, route) do
    if Map.get(page, route) do
      maybe_active_live_redirect(socket, page, text, route)
    else
      assigns = %{route: route, text: text}

      ~L"""
      <div class="menu-item menu-item-disabled">
        <%= @text %> <%= link "Enable", to: guide(@route), class: "menu-item-enable-button" %>
      </div>
      """
    end
  end

  defp guide(name), do: "https://hexdocs.pm/phoenix_live_dashboard/#{name}.html"
end
