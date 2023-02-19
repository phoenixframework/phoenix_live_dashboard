defmodule Phoenix.LiveDashboard.EtsInfoComponent do
  use Phoenix.LiveDashboard.Modal

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

  @impl Phoenix.LiveDashboard.Modal
  def decode_params("ETS" <> ref) do
    {:ok, :erlang.list_to_ref(String.to_charlist("#Ref" <> ref))}
  end

  def decode_params(_), do: :error

  @impl Phoenix.LiveComponent
  def render(assigns) do
    ~H"""
    <div class="tabular-info">
      <%= if @alive do %>
        <Phoenix.LiveDashboard.PageBuilder.label_value_list>
          <:elem label="ID"><%= @id %></:elem>
          <:elem label="Name"><%= @name %></:elem>
          <:elem label="Size"><%= @size %></:elem>
          <:elem label="Node"><%= @node %></:elem>
          <:elem label="Named table"><%= @named_table %></:elem>
          <:elem label="Read concurrency"><%= @read_concurrency %></:elem>
          <:elem label="Write concurrency"><%= @write_concurrency %></:elem>
          <:elem label="Compressed"><%= @compressed %></:elem>
          <:elem label="Memory"><%= @memory %></:elem>
          <:elem label="Owner"><%= @owner %></:elem>
          <:elem label="Heir"><%= @heir %></:elem>
          <:elem label="Type"><%= @type %></:elem>
          <:elem label="Keypos"><%= @keypos %></:elem>
          <:elem label="Protection"><%= @protection %></:elem>
        </Phoenix.LiveDashboard.PageBuilder.label_value_list>
      <% else %>
        <div class="tabular-info-not-exists mt-1 mb-3">ETS does not exist.</div>
      <% end %>
    </div>
    """
  end

  @impl Phoenix.LiveComponent
  def mount(socket) do
    {:ok, Enum.reduce(@info_keys, socket, &assign(&2, &1, nil))}
  end

  @impl Phoenix.LiveComponent
  def update(%{value: ref, path: path, page: page}, socket) do
    {:ok, socket |> assign(ref: ref, path: path, node: page.node) |> assign_info()}
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
