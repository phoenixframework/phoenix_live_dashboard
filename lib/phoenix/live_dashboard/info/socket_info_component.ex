defmodule Phoenix.LiveDashboard.SocketInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component
  alias Phoenix.LiveDashboard.SystemInfo

  @info_keys [
    :module,
    :send_oct,
    :recv_oct,
    :local_address,
    :foreign_address,
    :state,
    :type,
    :connected
  ]

  @impl true
  def render(assigns) do
    ~H"""
    <div class="tabular-info">
      <%= if @alive do %>
        <table class="table table-hover tabular-info-table">
          <tbody>
            <tr><td class="border-top-0">Module</td><td class="border-top-0"><pre><%= @module %></pre></td></tr>
            <tr><td>Sent</td><td><%= @send_oct %></td></tr>
            <tr><td>Received</td><td><%= @recv_oct %></td></tr>
            <tr><td>Local Address</td><td><%= @local_address %></td></tr>
            <tr><td>Foreign Address</td><td><%= @foreign_address %></td></tr>
            <tr><td>State</td><td><%= @state %></td></tr>
            <tr><td>Type</td><td><%= @type %></td></tr>
            <tr><td>Owner</td><td><pre><%= @connected %></pre></td></tr>
          </tbody>
        </table>
      <% else %>
        <div class="tabular-info-exits mt-1 mb-3">Port was closed or does not exist.</div>
      <% end %>
    </div>
    """
  end

  @impl true
  def mount(socket) do
    {:ok, Enum.reduce(@info_keys, socket, &assign(&2, &1, nil))}
  end

  @impl true
  def update(%{id: "Socket" <> port, path: path}, socket) do
    port = :erlang.list_to_port(String.to_charlist("#Port" <> port))
    {:ok, socket |> assign(:port, port) |> assign(:path, path) |> assign_info()}
  end

  defp assign_info(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_socket_info(assigns.port) do
      {:ok, info} ->
        Enum.reduce(info, socket, fn {key, val}, acc ->
          assign(acc, key, format_info(key, val, assigns.path))
        end)
        |> assign(alive: true)

      :error ->
        assign(socket, alive: false)
    end
  end

  defp format_info(key, val, _live_dashboard_path)
       when key in [:send_oct, :recv_oct],
       do: format_bytes(val)

  defp format_info(key, val, live_dashboard_path)
       when key in [:connected, :port],
       do: format_value(val, live_dashboard_path)

  defp format_info(key, val, _live_dashboard_path)
       when key in [:module, :local_address, :foreign_address, :state, :type],
       do: val
end
