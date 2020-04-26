defmodule Phoenix.LiveDashboard.BarComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def render(assigns) do
    ~L"""
    <div class="<%= @class %>">
      <div class="memory-usage-legend-entry d-flex align-items-center py-1 flex-grow-0">
        <%= @inner_content.([]) %>
      </div>
      <div class="progress-section mb-4">
        <section>
      <div class="progress <%= direction(@dir) %> flex-grow-1 mt-2">
            <div
              class="progress-bar"
              role="progressbar"
              aria-valuenow="<%= @percent %>"
              aria-valuemin="0"
              aria-valuemax="100"
              style="width: <%= @percent %>%"
            >
            </div>
          </div>
        </section>
      </div>
    </div>
    """
  end

  def direction(dir) when dir == :left, do: "flex-row-reverse"
  def direction(_), do: ""
end
