defmodule Phoenix.LiveDashboard.ModalComponent do
  use Phoenix.LiveDashboard.Web, :live_component
  alias Phoenix.LiveView.JS

  defp enable_fullscreen() do
    JS.hide()
    |> JS.toggle(to: "#fullscreen-off", display: "inline-block")
    |> JS.remove_class("modal-dialog", to: "#modal-container")
    |> JS.add_class("modal-fullscreen", to: "#modal-container")
  end

  defp disable_fullscreen() do
    JS.hide()
    |> JS.toggle(to: "#fullscreen-on", display: "inline-block")
    |> JS.remove_class("modal-fullscreen", to: "#modal-container")
    |> JS.add_class("modal-dialog", to: "#modal-container")
  end

  def render(assigns) do
    ~H"""
    <div id={@id} class="dash-modal modal"
      tabindex="-1"
      phx-capture-click="close"
      phx-window-keydown="close"
      phx-key="escape"
      phx-target={"##{@id}"}
      phx-page-loading>
      <div class="modal-dialog modal-lg" id="modal-container">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title"><%=@title %></h6>
            <div class="modal-action">
              <span phx-click={enable_fullscreen()} class="modal-action-item mr-3" id="fullscreen-on">
                 &#128470;&#xFE0E;
              </span>
              <span phx-click={disable_fullscreen()} class="modal-action-item mr-3" id="fullscreen-off" style="display: none;">
                 &#128471;&#xFE0E;
              </span>
              <%= live_patch raw("&times;"), to: @return_to, class: "modal-action-item mt-n1", id: "modal-close"%>
            </div>
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
