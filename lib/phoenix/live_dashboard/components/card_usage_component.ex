defmodule Phoenix.LiveDashboard.CardUsageComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def render(assigns) do
    ~L"""
    <div class="card progress-section mb-4">
      <%= live_component @socket, Phoenix.LiveDashboard.TitleBarComponent, dom_id: "#{@dom_id}-title-bar", class: "card-body", percent: percentage(@usage, @limit), csp_nonces: @csp_nonces do %>
        <div>
          <%= render_block @inner_block, [] %>
        </div>
        <div>
          <small class="text-muted pr-2">
            <%= @usage %> / <%= @limit %>
          </small>
          <strong>
            <%= used(@usage, @limit) %>%
          </strong>
        </div>
      <% end %>
    </div>
    """
  end

  defp used(usage, limit) do
    trunc(usage / limit * 100)
  end
end
