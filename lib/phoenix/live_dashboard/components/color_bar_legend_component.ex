defmodule Phoenix.LiveDashboard.ColorBarLegendComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def mount(socket) do
    {:ok, assign(socket, formatter: &format_percent/1)}
  end

  def render(assigns) do
    ~L"""
    <div class="resource-usage-legend">
      <div class="row">
      <%= for {name, value, color, hint} <- @data do %>
        <div class="col-lg-6 d-flex align-items-center py-1 flex-grow-0 resource-usage-legend-entry" data-name="<%= name %>">
          <div class="resource-usage-legend-color bg-<%= color %> mr-2"></div>
          <span><%= name %> <%= hint && hint(do: hint) %></span>
          <span class="flex-grow-1 text-right text-muted"><%= @formatter.(value) %></span>
        </div>
        <% end %>
      </div>
    </div>
    """
  end
end
