defmodule Phoenix.LiveDashboard.SystemLimitComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def render(assigns) do
    ~L"""
    <div class="card progress-section mb-4">
      <div class="card-body">
        <section>
          <div class="d-flex justify-content-between">
            <div>
              <%= @inner_content.([]) %>
            </div>
            <div>
              <small class="text-muted pr-2">
                <%= @usage %> / <%= @limit %>
              </small>
              <strong>
                <%= used(@usage, @limit) %>%
              </strong>
            </div>
          </div>

          <div class="progress flex-grow-1 mt-2">
            <div
              class="progress-bar"
              role="progressbar"
              aria-valuenow="<%= used(@usage, @limit) %>"
              aria-valuemin="0"
              aria-valuemax="100"
              style="width: <%= used(@usage, @limit) %>%"
            >
            </div>
          </div>
        </section>
      </div>
    </div>
    """
  end

  defp used(usage, limit) do
    trunc(usage / limit * 100)
  end
end
