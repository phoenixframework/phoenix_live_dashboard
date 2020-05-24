defmodule Phoenix.LiveDashboard.TitleBarComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def mount(socket) do
    {:ok, assign(socket, class: "", color: "blue")}
  end

  def render(assigns) do
    ~L"""
    <div class="<%= @class %>">
      <section>
        <div class="d-flex justify-content-between">
          <%= @inner_content.([]) %>
        </div>
        <div class="progress flex-grow-1 mt-2">
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
      </section>
    </div>
    """
  end
end
