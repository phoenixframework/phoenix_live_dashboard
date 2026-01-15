defmodule Phoenix.LiveDashboard.TitleBarComponent do
  use Phoenix.LiveDashboard.Web, :live_component
  use Phoenix.LiveDashboard.LiveCapture

  def mount(socket) do
    {:ok, assign(socket, class: "", color: "blue")}
  end

  capture attributes: Phoenix.LiveDashboard.LiveCaptureFactory.title_bar_assigns(),
          variants: [main: %{}, warning: %{percent: 87.2, color: "orange"}]
  def render(assigns) do
    ~H"""
    <div class={@class}>
      <section>
        <div class="d-flex justify-content-between">
          <%= render_slot(@inner_block) %>
        </div>
        <style nonce={@csp_nonces.style}>
          #<%= "#{@dom_id}-progress" %>{width:<%= @percent %>%}
        </style>
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
