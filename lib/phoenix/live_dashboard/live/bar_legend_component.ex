defmodule Phoenix.LiveDashboard.BarLegendComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def render(assigns) do
    ~L"""
    <div class="resource-usage-legend">
      <div class="resource-usage-legend-entries-<%= @height %> row flex-column flex-wrap">
        <%= for {_ , name, value, color} <- @data do %>
          <div class="col-lg-6 resource-usage-legend-entry-<%= @height %> d-flex align-items-center py-1 flex-grow-0">
            <div class="resource-usage-legend-color bg-<%= color %> mr-2"></div>
            <span><%= name %></span>
            <span class="flex-grow-1 text-right text-muted">
              <%= format_percent(value) %>
            </span>
          </div>
        <% end %>
        <%= @inner_content.([]) %>
      </div>
    </div>
    """
  end
end
