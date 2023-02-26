defmodule Phoenix.LiveDashboard.MemoryAllocatorsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  alias Phoenix.LiveDashboard.SystemInfo
  import Phoenix.LiveDashboard.Helpers

  @menu_text "Memory Allocators"

  @impl true
  def render(assigns) do
    ~H"""
    <.live_table
      id="memory-allocators-table"
      dom_id="memory-allocators-table"
      page={@page}
      title="Memory Allocators"
      row_fetcher={&fetch_memory_allocators/2}
      rows_name="memory allocators"
    >
      <:col field={:name} header="Name or module" />
      <:col field={:block_size} sortable={:desc} :let={alloc}>
        <%= format_bytes(alloc[:block_size]) %>
      </:col>
      <:col field={:current_carrier_size} header="Carrier size" sortable={:desc} :let={alloc}>
        <%= format_bytes(alloc[:current_carrier_size]) %>
      </:col>
      <:col field={:max_carrier_size} sortable={:desc} :let={alloc}>
        <%= format_bytes(alloc[:max_carrier_size]) %>
      </:col>

    </.live_table>
    """
  end

  defp fetch_memory_allocators(_params, node) do
    # TODO
    # %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    SystemInfo.fetch_memory_allocators(node)
  end

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end
end
