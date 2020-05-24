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
    ~L"""
    <div class="tabular-info">
      <%= if @alive do %>
        <table class="table table-hover tabular-info-table">
          <tbody>
            <tr><td class="border-top-0">Port Name</td><td class="border-top-0"><pre><%= @name %></pre></td></tr>
            <tr><td>Id</td><td><pre><%= @id %></pre></td></tr>
            <tr><td>Connected</td><td><pre><%= @connected %></pre></td></tr>
            <tr><td>Input</td><td><pre><%= format_bytes(@input) %></pre></td></tr>
            <tr><td>Output</td><td><pre><%= format_bytes(@output) %></pre></td></tr>
            <tr><td>OS pid</td><td><pre><%= @os_pid %></pre></td></tr>
            <tr><td>Links</td><td><pre><%= @links %></pre></td></tr>
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
  def update(%{id: "Port" <> _ = port, path: path}, socket) do
    port = :erlang.list_to_port(String.to_charlist("#" <> port))
    {:ok, socket |> assign(:port, port) |> assign(:path, path) |> assign_info()}
  end

  defp assign_info(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_port_info(assigns.port, @info_keys) do
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
end
