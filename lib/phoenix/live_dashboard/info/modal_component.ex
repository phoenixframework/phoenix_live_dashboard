defmodule Phoenix.LiveDashboard.ModalComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def render(assigns) do
    ~H"""
    <div id={@id} class="dash-modal modal"
      tabindex="-1"
      phx-capture-click="close"
      phx-window-keydown="close"
      phx-key="escape"
      phx-target={"##{@id}"}
      phx-page-loading>

      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title"><%=@title %></h6>
            <%= live_patch raw("&times;"), to: @return_to, class: "close" %>
          </div>
          <div class="modal-body">
            <%= live_component @component, @opts %>
          </div>
        </div>
      </div>
    </div>
    """
  end

  def handle_event("close", _, socket) do
    {:noreply, push_patch(socket, to: socket.assigns.return_to)}
  end
end
