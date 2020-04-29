defmodule Phoenix.LiveDashboard.BarComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def mount(socket) do
    {:ok, assign(socket, class: "", color: "blue")}
  end

  def render(assigns) do
    ~L"""
    <div class="<%= @class %>">
      <section>
        <div class="memory-usage-legend-entry d-flex align-items-center pt-1 flex-grow-0">
          <%= @inner_content.([]) %>
        </div>
        <div class="progress-section">
          <div class="progress flex-grow-1 mt-1">
            <div
            class="progress-bar bg-<%= @color %>"
            role="progressbar"
            aria-valuenow="<%= @percent %>"
            aria-valuemin="0"
            aria-valuemax="100"
            style="width: <%= @percent %>%"
            >
            </div>
          </div>
        </div>
      </section>
    </div>
    """
  end

  def direction(dir) when dir == :left, do: "flex-row-reverse"
  def direction(_), do: ""
end
