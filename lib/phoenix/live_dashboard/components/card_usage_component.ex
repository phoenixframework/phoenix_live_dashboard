defmodule Phoenix.LiveDashboard.CardUsageComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def render(assigns) do
    ~L"""
    <div class="card progress-section mb-4">
      <%= live_component @socket, Phoenix.LiveDashboard.TitleBarComponent, class: "card-body", percent: percentage(@usage, @limit) do %>
        <div>
          <%= @inner_content.([]) %>
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
