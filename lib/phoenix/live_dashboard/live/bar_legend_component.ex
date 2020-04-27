defmodule Phoenix.LiveDashboard.BarLegendComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def render(%{:options => options} = assigns) do
    height = if options[:height], do: options[:height], else: 3
    fn_format =
      if options[:fn_format], do: options[:fn_format], else: &format_percent(&1)

    ~L"""
    <div class="resource-usage-legend">
      <div class="resource-usage-legend-entries-<%= height %> row flex-column flex-wrap">
      <%= for {_ , name, value, color} <- @data do %>
        <div class="col-lg-6 resource-usage-legend-entry-<%= height %> d-flex align-items-center py-1 flex-grow-0">
          <div class="resource-usage-legend-color bg-<%= color %> mr-2"></div>
          <span><%= name %></span>
          <span class="flex-grow-1 text-right text-muted">
          <%= fn_format.(value) %>
          </span>
        </div>
        <% end %>
      </div>
    </div>
    """
  end
end
