defmodule Phoenix.LiveDashboard.EtsInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.SystemInfo

  @info_keys [
    :id,
    :name,
    :size,
    :node,
    :named_table,
    :read_concurrency,
    :write_concurrency,
    :compressed,
    :memory,
    :owner,
    :heir,
    :type,
    :keypos,
    :protection
  ]

  @impl true
  def render(assigns) do
    ~H"""
    <div class="tabular-info">
      <%= if @alive do %>
        <table class="table tabular-table-info-table">
          <tbody>
            <tr><td class="border-top-0">ID</td><td class="border-top-0"><pre><%= @id %></pre></td></tr>
            <tr><td>Name</td><td><pre><%= @name %></pre></td></tr>
            <tr><td>Size</td><td><pre><%= @size %></pre></td></tr>
            <tr><td>Node</td><td><pre><%= @node %></pre></td></tr>
            <tr><td>Named table</td><td><pre><%= @named_table %></pre></td></tr>
            <tr><td>Read concurrency</td><td><pre><%= @read_concurrency %></pre></td></tr>
            <tr><td>Write concurrency</td><td><pre><%= @write_concurrency %></pre></td></tr>
            <tr><td>Compressed</td><td><pre><%= @compressed %></pre></td></tr>
            <tr><td>Memory</td><td><pre><%= @memory %></pre></td></tr>
            <tr><td>Owner</td><td><pre><%= @owner %></pre></td></tr>
            <tr><td>Heir</td><td><pre><%= @heir %></pre></td></tr>
            <tr><td>Type</td><td><pre><%= @type %></pre></td></tr>
            <tr><td>Keypos</td><td><pre><%= @keypos %></pre></td></tr>
            <tr><td>Protection</td><td><pre><%= @protection %></pre></td></tr>
          </tbody>
        </table>
      <% else %>
        <div class="tabular-info-not-exists mt-1 mb-3">ETS does not exist.</div>
      <% end %>
    </div>
    """
  end

  @impl true
  def mount(socket) do
    {:ok, Enum.reduce(@info_keys, socket, &assign(&2, &1, nil))}
  end

  @impl true
  def update(%{id: "ETS" <> ref, path: path, node: node}, socket) do
    ref = :erlang.list_to_ref(String.to_charlist("#Ref" <> ref))

    {:ok, socket |> assign(ref: ref, path: path, node: node) |> assign_info()}
  end

  defp assign_info(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_ets_info(socket.assigns.node, assigns.ref) do
      {:ok, info} ->
        Enum.reduce(info, socket, fn {key, val}, acc ->
          assign(acc, key, format_info(key, val, assigns.path))
        end)
        |> assign(alive: true)

      :error ->
        assign(socket, alive: false)
    end
  end

  defp format_info(:memory, val, _live_dashboard_path), do: format_words(val)
  defp format_info(_key, val, live_dashboard_path), do: format_value(val, live_dashboard_path)
end
