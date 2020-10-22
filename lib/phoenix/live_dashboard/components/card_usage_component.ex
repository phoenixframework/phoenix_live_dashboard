defmodule Phoenix.LiveDashboard.CardUsageComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def render(assigns) do
    ~L"""
    <div class="card progress-section mb-4">
      <%= live_component @socket, Phoenix.LiveDashboard.TitleBarComponent, class: "card-body", percent: percentage(@usage, @limit) do %>
        <div>
          <%= case assigns do
            %{inner_block: _inner_block} -> render_block @inner_block, []
            %{inner_content: _inner_content} -> @inner_content.([])
          end %>
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
