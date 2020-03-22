defmodule Phoenix.LiveDashboard.RefresherLive do
  use Phoenix.LiveDashboard.Web, :live_view

  @default_refresh 5
  @supported_refresh [{"1s", 1}, {"2s", 2}, {"5s", 5}, {"15s", 15}, {"30s", 30}]

  @impl true
  def mount(_, %{"refresher" => %{enabled?: enabled?}}, socket) do
    socket = assign(socket, enabled?: enabled?, refresh: @default_refresh)

    {:ok, init_schedule_refresh(socket)}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <form phx-change="select_refresh">
      <div class="input-group input-group-sm">
        <%= if @enabled? do %>
          <div class="input-group-prepend">
            <label class="input-group-text" for="refresh-interval-select">Update every</label>
          </div>
          <select name="refresh" class="custom-select" id="refresh-interval-select">
            <%= options_for_select(refresh_options(), @refresh) %>
          </select>
        <% else %>
          <div class="input-group-prepend">
            <small class="input-group-text text-muted">Updates automatically</small>
          </div>
        <% end %>
      </div>
    </form>
    """
  end

  defp refresh_options() do
    @supported_refresh
  end

  @impl true
  def handle_info(:refresh, socket) do
    send(socket.root_pid, :refresh)
    {:noreply, schedule_refresh(socket)}
  end

  @impl true
  def handle_event("select_refresh", params, socket) do
    case Integer.parse(params["refresh"]) do
      {refresh, ""} -> {:noreply, assign(socket, refresh: refresh)}
      _ -> {:noreply, socket}
    end
  end

  ## Refresh helpers

  defp init_schedule_refresh(socket) do
    if connected?(socket) and socket.assigns.enabled? do
      schedule_refresh(socket)
    else
      assign(socket, timer: nil)
    end
  end

  defp schedule_refresh(socket) do
    assign(socket, timer: Process.send_after(self(), :refresh, socket.assigns.refresh * 1000))
  end
end

