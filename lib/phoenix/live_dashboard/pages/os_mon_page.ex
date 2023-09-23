defmodule Phoenix.LiveDashboard.OSMonPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  import Phoenix.LiveDashboard.Helpers

  alias Phoenix.LiveDashboard.SystemInfo

  @memory_usage_sections [
    {"Used", :used_memory, :system_total_memory,
     "The amount of memory used from the available memory"},
    {"Buffered", :buffered_memory, :system_total_memory,
     "The amount of memory used for temporary storing raw disk blocks"},
    {"Cached", :cached_memory, :system_total_memory,
     "The amount of memory used for cached files read from disk"},
    {"Swap", :used_swap, :total_swap,
     "The amount of disk swap memory used from the available swap"}
  ]
  @menu_text "OS Data"

  @impl true
  def init(opts) do
    {:ok, opts, application: :os_mon}
  end

  @impl true
  def mount(_params, _session, socket) do
    {:noreply, socket} = handle_refresh(socket)
    {:ok, socket}
  end

  @impl true
  def handle_refresh(socket) do
    os_mon = SystemInfo.fetch_os_mon_info(socket.assigns.page.node)

    socket =
      assign(socket,
        cpu: calculate_cpu_data(os_mon),
        mem_usages: calculate_memory_usage(os_mon.system_mem),
        disk_usages: calculate_disk_usage(os_mon.disk)
      )

    {:noreply, socket}
  end

  defp calculate_cpu_data(%{cpu_avg1: num1, cpu_avg5: num5, cpu_avg15: num15} = os_mon)
       when is_number(num1) and is_number(num5) and is_number(num15) do
    count = length(os_mon.cpu_per_core)

    %{
      count: count,
      load1: rup(num1),
      load5: rup(num5),
      load15: rup(num15),
      avg1: rup_avg(num1, count),
      avg5: rup_avg(num5, count),
      avg15: rup_avg(num15, count)
    }
  end

  defp calculate_cpu_data(_), do: nil

  defp rup(value), do: Float.ceil(value / 256, 2)

  defp rup_avg(_value, 0), do: 0
  defp rup_avg(value, count), do: Float.ceil(value / 256 / count, 2)

  defp calculate_memory_usage(system_memory) do
    for {key, value_key, total_key, hint} <- @memory_usage_sections,
        limit = system_memory[total_key],
        current = memory_value(system_memory, value_key, limit) do
      %{
        current: format_bytes(current),
        limit: format_bytes(limit),
        percent: percentage(current, limit),
        dom_id: value_key,
        hint: hint,
        title: key
      }
    end
  end

  defp memory_value(system_memory, :used_memory, total) do
    if free = Keyword.get(system_memory, :free_memory, 0) do
      total -
        (free + Keyword.get(system_memory, :cached_memory, 0) +
           Keyword.get(system_memory, :buffered_memory, 0))
    end
  end

  defp memory_value(system_memory, :used_swap, total) do
    if free = Keyword.get(system_memory, :free_swap, 0) do
      total - free
    end
  end

  defp memory_value(system_memory, key, _total), do: system_memory[key]

  defp calculate_disk_usage(system_disk) do
    system_disk
    |> Stream.with_index()
    |> Enum.map(fn {{mountpoint, kbytes, percent}, index} ->
      %{
        current: format_percent(percent),
        limit: format_bytes(kbytes * 1024),
        percent: percent,
        dom_id: index,
        title: mountpoint
      }
    end)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.row>
      <:col>
        <.cpu_components :if={@cpu} cpu={@cpu} />
      </:col>
      <:col>
        <.memory_components csp_nonces={@csp_nonces} mem_usages={@mem_usages} />
      </:col>
    </.row>
    <.row>
      <:col>
        <.disk_usage_row csp_nonces={@csp_nonces} disk_usages={@disk_usages} />
      </:col>
    </.row>
    """
  end

  defp cpu_components(assigns) do
    ~H"""
    <.cpu_load_row cpu={@cpu} />
    <.cpu_avg_row :if={multicore?(@cpu.count)} cpu={@cpu} />
    """
  end

  defp multicore?(cpu_count), do: cpu_count > 0

  defp cpu_load_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.card title="CPU" hint={cpu_hint(@cpu.count)} inner_title="Load 1 min">
          <%= @cpu.load1 %>
        </.card>
      </:col>
      <:col>
        <.card inner_title="Load 5 min"><%= @cpu.load5 %></.card>
      </:col>
      <:col>
        <.card inner_title="Load 15 min"><%= @cpu.load15 %></.card>
      </:col>
    </.row>
    """
  end

  defp cpu_avg_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.card inner_title="Avg 1 min"><%= @cpu.avg1 %></.card>
      </:col>
      <:col>
        <.card inner_title="Avg 5 min"><%= @cpu.avg5 %></.card>
      </:col>
      <:col>
        <.card inner_title="Avg 15 min"><%= @cpu.avg15 %></.card>
      </:col>
    </.row>
    """
  end

  defp memory_components(assigns) do
    ~H"""
    <.row>
      <:col>
        <.usage_card title="Memory" dom_id="memory" csp_nonces={@csp_nonces}>
          <:usage :for={usage_params <- @mem_usages} {usage_params} />
        </.usage_card>
      </:col>
    </.row>
    """
  end

  defp disk_usage_row(assigns) do
    ~H"""
    <.row>
      <:col>
        <.usage_card title="Disk" dom_id="disk" csp_nonces={@csp_nonces}>
          <:usage :for={usage_params <- @disk_usages} {usage_params} />
        </.usage_card>
      </:col>
    </.row>
    """
  end

  defp cpu_hint(_assigns) do
    Phoenix.HTML.raw("""
    <p>The load panes show the CPU demand in the last 1, 5 and 15 minutes over all cores.</p>
    <p>The avg panes show the same values averaged across all cores.</p>
    """)
  end

  @impl true
  def menu_link(_, capabilities) do
    if :os_mon in capabilities.applications do
      {:ok, @menu_text}
    else
      {:disabled, @menu_text, "https://hexdocs.pm/phoenix_live_dashboard/os_mon.html"}
    end
  end
end
