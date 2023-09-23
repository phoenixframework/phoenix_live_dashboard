defmodule Phoenix.LiveDashboard.MemoryAllocatorsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  alias Phoenix.LiveDashboard.SystemInfo
  import Phoenix.LiveDashboard.Helpers

  @menu_text "Memory Allocators"

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <div class="row">
        <.live_chart
          id={chart_id()}
          title="Memory Allocators"
          kind={:last_value}
          unit="KB"
          tags={["total"]}
          full_width={true}
        />
      </div>
      <.live_table
        id="memory-allocators-table"
        dom_id="memory-allocators-table"
        page={@page}
        title="Memory Allocators"
        row_fetcher={{&fetch_memory_allocators/3, nil}}
        rows_name="memory allocators"
        search={false}
        limit={false}
      >
        <:col field={:name} header="Name or module" />
        <:col :let={alloc} field={:block_size} sortable={:desc}>
          <%= format_bytes(alloc[:block_size]) %>
        </:col>
        <:col :let={alloc} field={:carrier_size} sortable={:desc}>
          <%= format_bytes(alloc[:carrier_size]) %>
        </:col>
        <:col :let={alloc} field={:max_carrier_size} sortable={:desc}>
          <%= format_bytes(alloc[:max_carrier_size]) %>
        </:col>
      </.live_table>
    </div>
    """
  end

  defp chart_id(), do: "memory-allocators-chart"

  defp fetch_memory_allocators(params, node, state) do
    %{sort_by: sort_by, sort_dir: sort_dir} = params

    {allocs, state} = SystemInfo.fetch_memory_allocators(node, state)

    allocs = Enum.sort_by(allocs, fn item -> item[sort_by] end, sort_dir)

    {allocs, length(allocs), state}
  end

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end

  @impl true
  def handle_refresh(socket) do
    {allocs, _} = SystemInfo.fetch_memory_allocators(socket.assigns.page.node, nil)
    now = DateTime.utc_now() |> DateTime.to_unix(:microsecond)

    chart_data =
      allocs
      |> Enum.reject(&(&1[:name] == :total))
      |> Enum.map(&{to_string(&1[:name]), &1[:carrier_size] / 1024, now})

    send_data_to_chart(chart_id(), chart_data)

    {:noreply, socket}
  end
end
