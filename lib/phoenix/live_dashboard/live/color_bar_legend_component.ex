defmodule Phoenix.LiveDashboard.ColorBarLegendComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def render(assigns) do
    height = if assigns[:height], do: assigns[:height], else: 3
    formatter = if assigns[:formatter], do: assigns[:formatter], else: &format_percent(&1)

    ~L"""
    <div class="resource-usage-legend">
      <div class="resource-usage-legend-entries-<%= height %> row flex-column flex-wrap">
      <%= for {_ , name, value, color} <- @data do %>
        <div class="col-lg-6 resource-usage-legend-entry-<%= height %> d-flex align-items-center py-1 flex-grow-0">
          <div class="resource-usage-legend-color bg-<%= color %> mr-2"></div>
          <span><%= name %></span>
          <span class="flex-grow-1 text-right text-muted">
          <%= formatter.(value) %>
          </span>
        </div>
        <% end %>
      </div>
    </div>
    """
  end
end
