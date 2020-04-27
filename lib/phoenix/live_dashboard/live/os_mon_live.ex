defmodule Phoenix.LiveDashboard.OSMonLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.{
    SystemInfo,
    BarComponent,
    ColorBarComponent,
    ColorBarLegendComponent
  }

  @temporary_assigns [system_info: nil, system_usage: nil]

  @cpu_usage_sections [
    {:kernel, "Kernel", "purple"},
    {:user, "User", "blue"},
    {:nice_user, "User nice", "green"},
    {:soft_irq, "Soft IRQ", "orange"},
    {:hard_irq, "Hard IRQ", "yellow"},
    {:steal, "Steal", "purple"},
    {:wait, "Wait", "orange"},
    {:idle, "Idle", "dark-gray"}
  ]
  @memory_usage_sections [
    {:in_use_memory, "In use", "purple"},
    {:buffered_memory, "Buffered", "green"},
    {:cached_memory, "Cached", "orange"},
    {:free_memory, "Free", "dark-gray"}
  ]

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    socket =
      socket
      |> assign_defaults(params, session, true)
      |> assign_system_info()

    {:ok, socket, temporary_assigns: @temporary_assigns}
  end

  def mount(_params, _session, socket) do
    {:ok, push_redirect(socket, to: live_dashboard_path(socket, :home, node()))}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="row">
      <!-- Left column -->
      <!-- Cpu information -->
      <div class="col-sm-6">
        <h5 class="card-title">
          CPU
        </h5>
        <div class="card mb-4">
          <div class="card-body resource-usage">
            <%= for {num_cpu, usage} <- @cpu_per_core do %>
              <div class="progress flex-grow-1 mb-3">
                <%= live_component @socket, ColorBarComponent, id: "c-#{num_cpu}", data: cpu_usage_sections(usage) %>
              </div>
            <% end %>
            <%= live_component @socket, ColorBarLegendComponent, data: cpu_usage_sections(@cpu_total), height: 4 %>
            <div class="resource-usage-total text-center py-1 mt-3">
              Number of OS processes: <%= @cpu_nprocs %>
            </div>
          </div>
        </div>

        <!-- Cpu total -->
        <h5 class="card-title">
          Total CPU
        </h5>
        <div class="card mb-4">
          <div class="card-body resource-usage">
            <%= live_component @socket, ColorBarComponent, id: :total_cpu, data: cpu_usage_sections(@cpu_total) %>
            <%= live_component @socket, ColorBarLegendComponent, data: cpu_usage_sections(@cpu_total), height: 4 %>
            <div class="row">
              <div class="col">
                <div class="resource-usage-total text-center py-1 mt-3">
                  Number of OS processes: <%= @cpu_nprocs %>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Usage over time data -->
        <h5 class="card-title">OS stats</h5>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">
                Cpu 1 min
              </h6>
              <div class="banner-card-value"><%= Float.ceil(@cpu_usage.avg1 / @cpu_count, 1) %>%</div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">
                Cpu 5 min
              </h6>
              <div class="banner-card-value"><%= Float.ceil(@cpu_usage.avg5 / @cpu_count, 1) %>%</div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">
                Cpu 15 min
              </h6>
              <div class="banner-card-value"><%= Float.ceil(@cpu_usage.avg15 / @cpu_count, 1) %>%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <!-- Memory data -->
      <div class="col-sm-6">
        <h5 class="card-title">
          Memory
        </h5>
        <div class="card mb-4">
          <div class="card-body resource-usage">
            <%= live_component @socket, ColorBarComponent, id: :memory_usage, data: memory_usage_sections(@system_mem) %>
            <%= live_component @socket, ColorBarLegendComponent, data: memory_usage_sections_bytes(@system_mem, @system_mem[:total_memory]), height: 2, formatter: &format_bytes(&1) %>
            <div class="row">
              <div class="col">
                <div class="resource-usage-total text-center py-1 mt-3">
                  Total memory: <%= format_bytes(@system_mem[:total_memory]) %>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Memory component data -->
        <h5 class="card-title">Memory usage / limits</h5>
        <div class="card progress-section mb-4">
          <%= live_component @socket, BarComponent, id: :memory, percent: percent_memory(@system_mem), dir: :left, class: "card-body" do %>
            Memory
             <span class="flex-grow-1"></span>
             <span class="text-right text-muted">
               <%= memory_description(@system_mem) %>
             </span>
          <% end %>
        </div>

      <!-- Swap component data -->
        <div class="card progress-section mb-4">
          <%= live_component @socket, BarComponent, id: :swap, percent: percent_swap(@system_mem), dir: :left, class: "card-body" do %>
            Swap
             <span class="flex-grow-1"></span>
             <span class="text-right text-muted">
               <%= swap_description(@system_mem) %>
             </span>
          <% end %>
        </div>

      <!-- Disk data -->
        <h5 class="card-title">Disk usage / limits</h5>
        <div class="card mb-4">
          <div class="card-body disk-usage">
            <%= for {mountpoint, total, percent} <- @disk do %>
              <%= live_component @socket, BarComponent, id: mountpoint, percent: percent, dir: :left, class: ""  do %>
                <%= mountpoint %>
                  <span class="flex-grow-1">
                </span>
                <span class="text-right text-muted">
                  <%= disk_description(percent, total) %>
                </span>
              <% end %>
            <% end %>
          </div>
        </div>

      </div>
    </div>
    """
  end

  def disk_description(percent, kbytes) do
    "#{format_percent(percent)} of #{format_k_bytes(kbytes)}"
  end

  def swap_description(%{free_swap: free, total_swap: total}) do
    "Free #{format_bytes(free)} of #{format_bytes(total)}"
  end

  def percent_swap(%{free_swap: free, total_swap: total}) do
    (total - free) / total * 100
  end

  def memory_description(%{free_memory: free, total_memory: total}) do
    "Free #{format_bytes(free)} of #{format_bytes(total)}"
  end

  def percent_memory(%{free_memory: free, total_memory: total}) do
    (total - free) / total * 100
  end

  defp bytes_from_percentage(percent, total) do
    trunc(percent * total / 100)
  end

  defp memory_usage_sections_bytes(memory_usage, total_memory) do
    memory_usage
    |> memory_usage_sections()
    |> Enum.map(fn {key, name, percent, color} ->
      bytes = bytes_from_percentage(percent, total_memory)
      {key, name, bytes, color}
    end)
  end

  defp memory_usage_sections(mem_usage) do
    @memory_usage_sections
    |> Enum.map(fn {key, name, color} ->
      value = percentage(mem_usage[key], mem_usage[:total_memory])

      {key, name, value, color}
    end)
  end

  defp cpu_usage_sections(cpu_usage) do
    @cpu_usage_sections
    |> Enum.map(fn {key, name, color} ->
      value = cpu_usage[key]

      {key, name, value, color}
    end)
  end

  defp assign_system_info(socket) do
    %{
      cpu_count: cpu_count,
      cpu_nprocs: cpu_nprocs,
      cpu_per_core: cpu_per_core,
      cpu_total: cpu_total,
      cpu_usage: cpu_usage,
      disk: disk,
      mem: mem,
      system_mem: system_mem
    } = SystemInfo.fetch_os_mon_info(socket.assigns.menu.node)

    assign(socket,
      cpu_count: cpu_count,
      cpu_nprocs: cpu_nprocs,
      cpu_per_core: cpu_per_core,
      cpu_total: cpu_total,
      cpu_usage: cpu_usage,
      disk: disk,
      mem: mem,
      system_mem: system_mem
    )
  end

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: live_dashboard_path(socket, :home, node))}
  end

  def handle_info(:refresh, socket) do
    {:noreply, assign_system_info(socket)}
  end
end
