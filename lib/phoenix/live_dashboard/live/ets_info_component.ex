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
    ~L"""
    <div class="tabular-info">
      <%= unless @alive do %>
        <div class="tabular-info-not-exists mt-1 mb-3">Table not exists.</div>
      <% end %>

      <table class="table tabular-table-info-table">
        <tbody>
          <tr><td class="border-top-0">ID</td><td class="border-top-0"><pre><%= @id %></pre></td></tr>
          <tr><td class="border-top-0">Name</td><td class="border-top-0"><pre><%= @name %></pre></td></tr>
          <tr><td class="border-top-0">Size</td><td class="border-top-0"><pre><%= @size %></pre></td></tr>
          <tr><td class="border-top-0">Node</td><td class="border-top-0"><pre><%= @node %></pre></td></tr>
          <tr><td class="border-top-0">Named table</td><td class="border-top-0"><pre><%= @named_table %></pre></td></tr>
          <tr><td class="border-top-0">Read concurrency</td><td class="border-top-0"><pre><%= @read_concurrency %></pre></td></tr>
          <tr><td class="border-top-0">Write concurrency</td><td class="border-top-0"><pre><%= @write_concurrency %></pre></td></tr>
          <tr><td class="border-top-0">Compressed</td><td class="border-top-0"><pre><%= @compressed %></pre></td></tr>
          <tr><td class="border-top-0">Memory</td><td class="border-top-0"><pre><%= @memory %></pre></td></tr>
          <tr><td class="border-top-0">Owner</td><td class="border-top-0"><pre><%= @owner %></pre></td></tr>
          <tr><td class="border-top-0">Heir</td><td class="border-top-0"><pre><%= @heir %></pre></td></tr>
          <tr><td class="border-top-0">Type</td><td class="border-top-0"><pre><%= @type %></pre></td></tr>
          <tr><td class="border-top-0">Keypos</td><td class="border-top-0"><pre><%= @keypos %></pre></td></tr>
          <tr><td class="border-top-0">Protection</td><td class="border-top-0"><pre><%= @protection %></pre></td></tr>
        </tbody>
      </table>
    </div>
    """
  end

  @impl true
  def mount(socket) do
    {:ok, Enum.reduce(@info_keys, socket, &assign(&2, &1, nil))}
  end

  @impl true
  def update(%{id: ref} = assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(ref: ref)
     |> assign_info()}
  end

  defp assign_info(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_ets_info(assigns.ref) do
      {:ok, info} ->
        Enum.reduce(info, socket, fn {key, val}, acc ->
          assign(acc, key, format_info(key, val, assigns.live_dashboard_path))
        end)
        |> assign(alive: true)

      :error ->
        assign(socket, alive: false)
    end
  end

  defp format_info(:memory, val, _live_dashboard_path), do: format_words(val)
  defp format_info(_key, val, live_dashboard_path), do: format_value(val, live_dashboard_path)
end
