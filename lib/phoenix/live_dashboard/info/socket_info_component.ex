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
        <Phoenix.LiveDashboard.PageBuilder.label_value_list>
          <:elem label="Module"><%= @module %></:elem>
          <:elem label="Sent"><%= @send_oct %></:elem>
          <:elem label="Received"><%= @recv_oct %></:elem>
          <:elem label="Local Address"><%= @local_address %></:elem>
          <:elem label="Foreign Address"><%= @foreign_address %></:elem>
          <:elem label="State"><%= @state %></:elem>
          <:elem label="Type"><%= @type %></:elem>
          <:elem label="Owner"><%= @connected %></:elem>
        </Phoenix.LiveDashboard.PageBuilder.label_value_list>
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
