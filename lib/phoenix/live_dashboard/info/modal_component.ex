defmodule Phoenix.LiveDashboard.ModalComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  def mount(socket) do
    {:ok, assign(socket, fullscreen?: false)}
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

      <div class={if @fullscreen?, do: "modal-fullscreen", else: "modal-dialog modal-lg"}>
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title"><%=@title %></h6>
            <div class="modal-action">
              <span phx-click="toggle-fullscreen" phx-target={@myself} class="modal-action-item mr-3">
                <%= fullscreen_icon(@fullscreen?) %>
              </span>
              <%= live_patch raw("&times;"), to: @return_to, class: "modal-action-item mt-n1" %>
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

  defp fullscreen_icon(true),
    do: raw("&#128471;&#xFE0E;")
  defp fullscreen_icon(false),
    do: raw("&#128470;&#xFE0E;")


  def handle_event("toggle-fullscreen", _, socket) do
    {:noreply, assign(socket, fullscreen?: !socket.assigns.fullscreen?)}
  end

  def handle_event("close", _, socket) do
    {:noreply, push_patch(socket, to: socket.assigns.return_to)}
  end
end
