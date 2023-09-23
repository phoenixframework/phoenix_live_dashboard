defmodule Phoenix.LiveDashboard.PortInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.SystemInfo

  @info_keys [
    :name,
    :links,
    :id,
    :connected,
    :input,
    :output,
    :os_pid
  ]

  @impl true
  def render(assigns) do
    ~H"""
    <div class="tabular-info">
      <%= if @alive do %>
        <Phoenix.LiveDashboard.PageBuilder.label_value_list>
          <:elem label="Port Name"><%= @name %></:elem>
          <:elem label="Id"><%= @id %></:elem>
          <:elem label="Connected"><%= @connected %></:elem>
          <:elem label="Input"><%= format_bytes(@input) %></:elem>
          <:elem label="Output"><%= format_bytes(@output) %></:elem>
          <:elem label="OS pid"><%= @os_pid %></:elem>
          <:elem label="Links"><.info links={@links} /></:elem>
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
  def update(%{id: "Port" <> _ = port, path: path}, socket) do
    port = :erlang.list_to_port(String.to_charlist("#" <> port))
    {:ok, socket |> assign(port: port, path: path) |> assign_info()}
  end

  defp assign_info(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_port_info(assigns.port) do
      {:ok, info} ->
        Enum.reduce(info, socket, fn {key, val}, acc ->
          assign(acc, key, format_info(key, val, assigns.path))
        end)
        |> assign(alive: true)

      :error ->
        assign(socket, alive: false)
    end
  end

  defp format_info(key, val, live_dashboard_path)
       when key in [:links],
       do: format_value(val, live_dashboard_path)

  defp format_info(key, val, _live_dashboard_path)
       when key in [:name, :id, :input, :output, :os_pid],
       do: val

  defp format_info(_key, val, live_dashboard_path), do: format_value(val, live_dashboard_path)

  defp info(%{links: links} = assigns) when is_list(links) do
    ~H"""
    <%= for info <- @links do %>
      <%= info %>
    <% end %>
    """
  end

  defp info(%{links: _links} = assigns), do: ~H|<%= @links %>|
end
