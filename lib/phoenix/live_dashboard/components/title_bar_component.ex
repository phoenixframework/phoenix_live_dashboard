defmodule Phoenix.LiveDashboard.TitleBarComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def mount(socket) do
    {:ok, assign(socket, class: "", color: "blue")}
  end

  def render(assigns) do
    ~H"""
    <div class={@class}>
      <section>
        <div class="d-flex justify-content-between">
          <%= render_block @inner_block, [] %>
        </div>
        <style nonce={@csp_nonces.style}>#<%= "#{@dom_id}-progress" %>{width:<%= @percent %>%}</style>
        <div class="progress flex-grow-1 mt-2">
          <div
          class={"progress-bar bg-#{@color}"}
          role="progressbar"
          aria-valuenow={@percent}
          aria-valuemin="0"
          aria-valuemax="100"
          id={"#{@dom_id}-progress"}
          >
          </div>
        </div>
      </section>
    </div>
    """
  end
end
