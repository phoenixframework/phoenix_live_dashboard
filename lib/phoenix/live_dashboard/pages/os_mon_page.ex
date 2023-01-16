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
  def render_page(assigns) do
    # FIXME this is wrong we should do it in mount
    os_mon = SystemInfo.fetch_os_mon_info(assigns.page.node)
    cpu_count = length(os_mon.cpu_per_core)
    assigns = assign(assigns, os_mon: os_mon, cpu_count: cpu_count)
    # row_params = %{os_mon: os_mon, cpu_count: cpu_count, csp_nonces: assigns.csp_nonces}

    # top_row = cpu_components(row_params) ++ memory_components(row_params)
    # bottom_row = [disk_usage_row(row_params)]

    ~H"""
    <.ac_row>
      <:col>
        <.cpu_components {assigns}/>
      </:col>
      <:col>
        <.memory_components {assigns}/>
      </:col>
    </.ac_row>
    <.ac_row>
      <:col>
        <.disk_usage_row {assigns}/>
      </:col>
    </.ac_row>
    """

    # row(
    #   components: [
    #     columns(components: top_row),
    #     columns(components: bottom_row)
    #   ]
    # )
  end

  defp cpu_components(%{os_mon: %{cpu_avg1: num1, cpu_avg5: num5, cpu_avg15: num15}} = assigns)
       when is_number(num1) and is_number(num5) and is_number(num15) do
    ~H"""
    <.cpu_load_row {assigns}/>
    <.cpu_avg_row :if={multicore?(@cpu_count)} {assigns}/>
    """
  end

  defp cpu_components(%{}), do: []

  defp multicore?(cpu_count), do: cpu_count > 0

  defp memory_components(assigns) do
    ~H"""
    <.ac_row>
      <:col>
        <.ac_usage_card
          title="Memory"
          dom_id="memory"
          usages={calculate_memory_usage(@os_mon.system_mem)}
          csp_nonces={@csp_nonces}
        />
      </:col>
    </.ac_row>
    """
  end

  defp calculate_memory_usage(system_memory) do
    for {key, value_key, total_key, hint} <- @memory_usage_sections,
        limit = system_memory[total_key],
        current = memory_value(system_memory, value_key, limit) do
      %{
        current: format_bytes(current),
        limit: format_bytes(limit),
        percent: percentage(current, limit),
        dom_sub_id: value_key,
        hint: hint,
        title: key
      }
    end
  end

  defp cpu_load_row(assigns) do
    ~H"""
    <.ac_row>
      <:col>
        <.ac_card title="CPU" hint={cpu_hint(@cpu_count)} inner_title="Load 1 min">
          <%= rup(@os_mon.cpu_avg1) %>
        </.ac_card>
      </:col>
      <:col>
        <.ac_card inner_title="Load 5 min"> <%= rup(@os_mon.cpu_avg5) %> </.ac_card>
      </:col>
      <:col>
        <.ac_card inner_title="Load 15 min"> <%= rup(@os_mon.cpu_avg15) %> </.ac_card>
      </:col>
    </.ac_row>
    """
  end

  defp cpu_avg_row(assigns) do
    ~H"""
    <.ac_row>
      <:col>
        <.ac_card inner_title="Avg 1 min"><%= rup_avg(@os_mon.cpu_avg1, @cpu_count) %></.ac_card>
      </:col>
      <:col>
        <.ac_card inner_title="Avg 5 min"><%= rup_avg(@os_mon.cpu_avg5, @cpu_count) %></.ac_card>
      </:col>
      <:col>
        <.ac_card inner_title="Avg 15 min"><%= rup_avg(@os_mon.cpu_avg15, @cpu_count) %></.ac_card>
      </:col>
    </.ac_row>
    """
  end

  defp disk_usage_row(assigns) do
    ~H"""
    <.ac_row>
      <:col>
        <.ac_usage_card
          title="Disk"
          usages={calculate_disk_usage(@os_mon.disk)}
          dom_id="disk"
          csp_nonces={@csp_nonces}
        />
      </:col>
    </.ac_row>
    """
  end

  defp calculate_disk_usage(system_disk) do
    system_disk
    |> Stream.with_index()
    |> Enum.map(fn {{mountpoint, kbytes, percent}, index} ->
      %{
        current: format_percent(percent),
        limit: format_bytes(kbytes * 1024),
        percent: percent,
        dom_sub_id: index,
        title: mountpoint
      }
    end)
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

  defp rup(value), do: Float.ceil(value / 256, 2)

  defp rup_avg(value, count), do: Float.ceil(value / 256 / count, 2)

  defp cpu_hint(_assigns) do
    # FIXME Allow hint to recieve a slot instead a text
    # ~H"""
    # <p>The load panes show the CPU demand in the last 1, 5 and 15 minutes over all cores.</p>

    # <%= if @cpu_count > 0 do %>
    #     <p>The avg panes show the same values averaged across all cores.</p>
    # <% end %>
    # """
    """
    <p>The load panes show the CPU demand in the last 1, 5 and 15 minutes over all cores.</p>
    <p>The avg panes show the same values averaged across all cores.</p>
    """
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
