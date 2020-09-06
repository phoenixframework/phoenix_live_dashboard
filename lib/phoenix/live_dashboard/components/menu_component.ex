defmodule Phoenix.LiveDashboard.MenuComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @derive {Inspect, only: []}
  defstruct links: [],
            nodes: [],
            refresher?: true,
            refresh: 5,
            refresh_options: [{"1s", 1}, {"2s", 2}, {"5s", 5}, {"15s", 15}, {"30s", 30}],
            timer: nil

  @impl true
  def render(assigns) do
    ~L"""
    <div id="menu">
      <nav id="menu-bar">
        <%= for link <- @menu.links, link != :skip do %>
          <%= maybe_link(@socket, @page, link) %>
        <% end %>
      </nav>

      <form id="node-selection" phx-change="select_node" class="d-inline">
        <div class="input-group input-group-sm d-flex flex-column">
          <div class="input-group-prepend">
            <label class="input-group-text" for="node-select">Selected node:</label>
          </div>
          <select name="node" class="custom-select" id="node-select">
            <%= options_for_select(@menu.nodes, @page.node) %>
          </select>
        </div>
      </form>

      <div id="refresher">
        <form phx-change="select_refresh">
          <div class="input-group input-group-sm">
            <%= if @menu.refresher? do %>
              <div class="input-group-prepend">
                <label class="input-group-text" for="refresh-interval-select">Update every</label>
              </div>
              <select name="refresh" class="custom-select" id="refresh-interval-select">
                <%= options_for_select(@menu.refresh_options, @menu.refresh) %>
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

  defp maybe_link(_socket, _page, {:current, text}) do
    content_tag(:div, text, class: "menu-item active")
  end

  defp maybe_link(socket, page, {:enabled, text, route}) do
    live_redirect(text,
      to: live_dashboard_path(socket, route, page.node, []),
      class: "menu-item"
    )
  end

  defp maybe_link(_socket, _page, {:disabled, text}) do
    assigns = %{text: text}

    ~L"""
    <div class="menu-item menu-item-disabled">
      <%= @text %>
    </div>
    """
  end

  defp maybe_link(_socket, _page, {:disabled, text, more_info_url}) do
    assigns = %{more_info_url: more_info_url, text: text}

    ~L"""
    <div class="menu-item menu-item-disabled">
      <%= @text %> <%= link "Enable", to: @more_info_url, class: "menu-item-enable-button" %>
    </div>
    """
  end
end
