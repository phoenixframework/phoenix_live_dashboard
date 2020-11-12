defmodule Phoenix.LiveDashboard.OSMonPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  alias Phoenix.LiveDashboard.{
    SystemInfo,
    ColorBarComponent,
    ColorBarLegendComponent,
    TitleBarComponent
  }

  @temporary_assigns [os_mon: nil, memory_usage: nil, cpu_total: nil, cpu_count: 0]

  @cpu_usage_sections [
    {:kernel, "Kernel", "purple", "Executing code in kernel mode"},
    {:user, "User", "blue", "Executing code in user mode"},
    {:nice_user, "User nice", "green", "Executing code in low-priority (nice)"},
    {:soft_irq, "Soft IRQ", "orange", "Executing soft interrupts"},
    {:hard_irq, "Hard IRQ", "yellow", "Executing hard interrupts"},
    {:steal, "Steal", "purple", "Stolen time spent in virtualized OSes"},
    {:wait, "Waiting", "orange", nil},
    {:idle, "Idle", "light-gray", nil}
  ]

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
    socket = assign_os_mon(socket)
    {:ok, socket, temporary_assigns: @temporary_assigns}
  end

  defp assign_os_mon(socket) do
    os_mon = SystemInfo.fetch_os_mon_info(socket.assigns.page.node)
    cpu_count = length(os_mon.cpu_per_core)

    assign(socket,
      os_mon: os_mon,
      cpu_count: cpu_count,
      cpu_total: calculate_cpu_total(os_mon.cpu_per_core, cpu_count),
      memory_usage: calculate_memory_usage(os_mon.system_mem)
    )
  end

  defp calculate_memory_usage(system_memory) do
    for {key, value_key, total_key, hint} <- @memory_usage_sections,
        total = system_memory[total_key],
        value = memory_value(system_memory, value_key, total) do
      {key, value, total, percentage(value, total), hint}
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

  defp calculate_cpu_total([], _cpu_count), do: nil

  defp calculate_cpu_total([{_, core}], _cpu_count), do: core

  defp calculate_cpu_total([{_, keys} | _] = per_core, cpu_count) do
    keys
    |> Map.keys()
    |> Enum.map(fn key -> {key, avg_cpu_usage(per_core, key, cpu_count)} end)
  end

  defp avg_cpu_usage(map, key, count) do
    map
    |> Enum.map(fn {_n, values} -> values[key] end)
    |> Enum.sum()
    |> Kernel./(count)
    |> Float.ceil(1)
  end

  @impl true
  def menu_link(_, capabilities) do
    if :os_mon in capabilities.applications do
      {:ok, @menu_text}
    else
      {:disabled, @menu_text, "https://hexdocs.pm/phoenix_live_dashboard/os_mon.html"}
    end
  end

  @impl true
  def render_page(_assigns), do: raise("this page is special cased to use render/2 instead")

  def render(assigns) do
    ~L"""
    <div class="row">
      <%= if @os_mon.cpu_nprocs > 0 do %>
        <div class="col-sm-6">
          <h5 class="card-title">
            CPU
            <%= hint do %>
              <p>The load panes show the CPU demand in the last 1, 5 and 15 minutes over all cores.</p>

              <%= if @cpu_count > 0 do %>
                <p>The avg panes show the same values averaged across all cores.</p>
              <% end %>
             <% end %>
          </h5>

          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="banner-card">
                <h6 class="banner-card-title">
                  Load 1 min
                </h6>
                <div class="banner-card-value"><%= rup(@os_mon.cpu_avg1) %></div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="banner-card">
                <h6 class="banner-card-title">
                  Load 5 min
                </h6>
                <div class="banner-card-value"><%= rup(@os_mon.cpu_avg5) %></div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="banner-card">
                <h6 class="banner-card-title">
                  Load 15 min
                </h6>
                <div class="banner-card-value"><%= rup(@os_mon.cpu_avg15) %></div>
              </div>
            </div>

            <%= if @cpu_count > 0 do %>
              <div class="col-md-4 mb-4">
                <div class="banner-card">
                  <h6 class="banner-card-title">
                    Avg 1 min
                  </h6>
                  <div class="banner-card-value"><%= rup_avg(@os_mon.cpu_avg1, @cpu_count) %></div>
                </div>
              </div>
              <div class="col-md-4 mb-4">
                <div class="banner-card">
                  <h6 class="banner-card-title">
                    Avg 5 min
                  </h6>
                  <div class="banner-card-value"><%= rup_avg(@os_mon.cpu_avg5, @cpu_count) %></div>
                </div>
              </div>
              <div class="col-md-4 mb-4">
                <div class="banner-card">
                  <h6 class="banner-card-title">
                    Avg 15 min
                  </h6>
                  <div class="banner-card-value"><%= rup_avg(@os_mon.cpu_avg15, @cpu_count) %></div>
                </div>
              </div>
            </div>
          <% end %>

          <%= if @cpu_total do %>
            <div class="card mb-4">
              <div class="card-body resource-usage">
                <div phx-hook="PhxColorBarHighlight" id="cpu-color-bars">
                  <%= for {num_cpu, usage} <- @os_mon.cpu_per_core do %>
                    <div class="progress flex-grow-1 mb-3">
                      <%= live_component @socket, ColorBarComponent, dom_id: "cpu-#{num_cpu}", data: cpu_usage_sections(usage), title: "CPU #{num_cpu+1}", csp_nonces: @csp_nonces %>
                    </div>
                  <% end %>
                  <div class="progress flex-grow-1 mb-3">
                    <%= live_component @socket, ColorBarComponent, dom_id: "cpu-total", data: cpu_usage_sections(@cpu_total), title: "TOTAL", csp_nonces: @csp_nonces %>
                  </div>
                  <%= live_component @socket, ColorBarLegendComponent, data: cpu_usage_sections(@cpu_total) %>
                  <div class="resource-usage-total text-center py-1 mt-3">
                    Number of OS processes: <%= @os_mon.cpu_nprocs %>
                  </div>
                </div>
              </div>
            </div>
          <% end %>
        </div>
      <% end %>

      <%= if @memory_usage != [] do %>
        <div class="<%= if @os_mon.cpu_nprocs > 0, do: "col-sm-6", else: "col-12" %>">
          <h5 class="card-title">Memory</h5>
          <%= for {{title, value, total, percent, hint}, index} <- Enum.with_index(@memory_usage) do %>
            <div class="card progress-section mb-4">
              <%= live_component @socket, TitleBarComponent, dom_id: "memory-#{index}", percent: percent, class: "card-body", csp_nonces: @csp_nonces do %>
                <div>
                  <%= title %>&nbsp;<%= hint(do: hint) %>
                </div>
                <div>
                  <small class="text-muted mr-2">
                    <%= format_bytes(value) %> of <%= format_bytes(total) %>
                  </small>
                  <strong><%= percent %>%</strong>
                </div>
              <% end %>
            </div>
          <% end %>
        </div>
      <% end %>

      <%= if @os_mon.disk != [] do %>
        <div class="col-12">
          <h5 class="card-title">Disk</h5>
          <div class="card progress-section mb-4">
            <div class="card-body">
              <%= for {{mountpoint, kbytes, percent}, index} <- Enum.with_index(@os_mon.disk) do %>
                <%= live_component @socket, TitleBarComponent, dom_id: "disk-#{index}", percent: percent, class: "py-2", csp_nonces: @csp_nonces do %>
                  <div>
                    <%= mountpoint %>
                  </div>
                  <div>
                    <span class="text-muted mt-2">
                      <%= format_percent(percent) %> of <%= format_bytes(kbytes * 1024) %>
                    </span>
                  </div>
                <% end %>
              <% end %>
            </div>
          </div>
        </div>
      <% end %>
    </div>
    """
  end

  defp rup(value), do: Float.ceil(value / 256, 2)
  defp rup_avg(value, count), do: Float.ceil(value / 256 / count, 2)

  defp cpu_usage_sections(cpu_usage) do
    for {key, name, color, desc} <- @cpu_usage_sections, value = cpu_usage[key] do
      {name, value, color, desc}
    end
  end

  @impl true
  def handle_refresh(socket) do
    {:noreply, assign_os_mon(socket)}
  end
end
