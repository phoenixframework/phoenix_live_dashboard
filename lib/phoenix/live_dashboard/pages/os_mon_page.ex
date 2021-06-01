defmodule Phoenix.LiveDashboard.OSMonPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  import Phoenix.HTML
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
    os_mon = SystemInfo.fetch_os_mon_info(assigns.page.node)
    cpu_count = length(os_mon.cpu_per_core)
    row_params = %{os_mon: os_mon, cpu_count: cpu_count, csp_nonces: assigns.csp_nonces}

    row(
      components: [
        columns(
          components: [
            [
              cpu_load_row(row_params),
              cpu_avg_row(row_params)
            ],
            [
              memory_usage_row(row_params)
            ]
          ]
        ),
        columns(components: [disk_usage_row(row_params)])
      ]
    )
  end

  defp cpu_load_row(%{os_mon: os_mon} = assigns) do
    row(
      components: [
        columns(
          components: [
            card(
              title: "CPU",
              hint: cpu_hint(assigns),
              inner_title: "Load 1 min",
              value: rup(os_mon.cpu_avg1)
            ),
            card(inner_title: "Load 5 min", value: rup(os_mon.cpu_avg5)),
            card(inner_title: "Load 15 min", value: rup(os_mon.cpu_avg15))
          ]
        )
      ]
    )
  end

  defp cpu_avg_row(%{os_mon: os_mon, cpu_count: cpu_count}) do
    row(
      components: [
        columns(
          components: [
            card(inner_title: "Avg 1 min", value: rup_avg(os_mon.cpu_avg1, cpu_count)),
            card(inner_title: "Avg 5 min", value: rup_avg(os_mon.cpu_avg5, cpu_count)),
            card(inner_title: "Avg 15 min", value: rup_avg(os_mon.cpu_avg15, cpu_count))
          ]
        )
      ]
    )
  end

  defp memory_usage_row(%{os_mon: os_mon}) do
    params = memory_usage_params(os_mon)

    row(
      components: [
        columns(
          components: [
            usage_card(params)
          ]
        )
      ]
    )
  end

  defp disk_usage_row(%{os_mon: os_mon}) do
    params = disk_usage_params(os_mon)

    row(
      title: "Disk",
      components: [
        columns(
          components: [
            usage_card(params)
          ]
        )
      ]
    )
  end

  defp memory_usage_params(os_mon) do
    usages = calculate_memory_usage(os_mon.system_mem)

    [title: "Memory", usages: usages, dom_id: "memory"]
  end

  defp disk_usage_params(os_mon) do
    usages = calculate_disk_usage(os_mon.disk)

    [title: "Disk", usages: usages, dom_id: "disk"]
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

  defp cpu_hint(assigns) do
    ~E"""
    <p>The load panes show the CPU demand in the last 1, 5 and 15 minutes over all cores.</p>

    <%= if @cpu_count > 0 do %>
        <p>The avg panes show the same values averaged across all cores.</p>
    <% end %>
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
