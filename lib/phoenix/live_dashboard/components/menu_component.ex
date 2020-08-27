defmodule Phoenix.LiveDashboard.MenuComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def render(assigns) do
    ~L"""
    <div id="menu">
      <nav id="menu-bar">
        <%= for {route, {module, session}} <- @pages do %>
          <%= maybe_link(@socket, @page, module, session, route) %>
        <% end %>
      </nav>

      <form id="node-selection" phx-change="select_node" class="d-inline">
        <div class="input-group input-group-sm d-flex flex-column">
          <div class="input-group-prepend">
            <label class="input-group-text" for="node-select">Selected node:</label>
          </div>
          <select name="node" class="custom-select" id="node-select">
            <%= options_for_select(@nodes, @page.node) %>
          </select>
        </div>
      </form>

      <div id="refresher">
        <form phx-change="select_refresh">
          <div class="input-group input-group-sm">
            <%= if @refresher? do %>
              <div class="input-group-prepend">
                <label class="input-group-text" for="refresh-interval-select">Update every</label>
              </div>
              <select name="refresh" class="custom-select" id="refresh-interval-select">
                <%= options_for_select(@refresh_options, @refresh) %>
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

  defp maybe_link(socket, page, module, session, route) do
    case module.menu_link(session, page.capabilities) do
      {:ok, text} ->
        if Atom.to_string(page.route) == route do
          content_tag(:div, text, class: "menu-item active")
        else
          live_redirect(text,
            to: live_dashboard_path(socket, route, page.node, []),
            class: "menu-item"
          )
        end

      {:disabled, text} ->
        assigns = %{text: text}

        ~L"""
        <div class="menu-item menu-item-disabled">
          <%= @text %>
        </div>
        """

      {:disabled, text, more_info_url} ->
        assigns = %{more_info_url: more_info_url, text: text}

        ~L"""
        <div class="menu-item menu-item-disabled">
          <%= @text %> <%= link "Enable", to: @more_info_url, class: "menu-item-enable-button" %>
        </div>
        """

      :skip ->
        []
    end
  end
end
