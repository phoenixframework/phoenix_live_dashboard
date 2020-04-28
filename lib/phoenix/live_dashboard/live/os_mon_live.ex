defmodule Phoenix.LiveDashboard.OSMonLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.{
    SystemInfo,
    BarComponent,
    ColorBarComponent,
    ColorBarLegendComponent
  }

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
    {:buffered_memory, "Buffered", "purple"},
    {:cached_memory, "Cached", "purple"},
    {:free_memory, "Free", "purple"}
  ]
  @hide_disks ~w"/dev /run /sys"

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    socket =
      socket
      |> assign_defaults(params, session, true)

    socket =
      socket
      |> assign(:os_mon, SystemInfo.fetch_os_mon_info(socket.assigns.menu.node))

    {:ok, socket}
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
        <%= if @os_mon.cpu_count > 0 do %>
          <h5 class="card-title">
            Detailed CPU
          </h5>
          <div class="card mb-4">
            <div class="card-body resource-usage">
              <%= for {num_cpu, usage} <- @os_mon.cpu_per_core do %>
                <div class="progress flex-grow-1 mb-3">
                  <%= live_component @socket, ColorBarComponent, id: "c-#{num_cpu}", data: cpu_usage_sections(usage) %>
                </div>
              <% end %>
              <%= live_component @socket, ColorBarLegendComponent, data: cpu_usage_sections(@os_mon.cpu_total), height: 4 %>
            </div>
          </div>
        <% else %>
          <h5 class="card-title">
            No CPU data found. Is os_mon running?
          </h5>
        <% end %>

        <!-- Cpu total -->
        <%= if @os_mon.cpu_count > 0 do %>
          <h5 class="card-title">
            Total CPU
          </h5>
          <div class="card mb-4">
            <div class="card-body resource-usage">
              <%= live_component @socket, ColorBarComponent, id: :total_cpu, data: cpu_usage_sections(@os_mon.cpu_total) %>
              <%= live_component @socket, ColorBarLegendComponent, data: cpu_usage_sections(@os_mon.cpu_total), height: 4 %>
              <div class="row">
                <div class="col">
                  <%= if @os_mon.cpu_nprocs > 0 do %>
                    <div class="resource-usage-total text-center py-1 mt-3">
                      Number of OS processes: <%= @os_mon.cpu_nprocs %>
                    </div>
                  <% end %>
                </div>
              </div>
            </div>
          </div>
        <% end %>

      <!-- Usage over time data -->
        <%= if @os_mon.cpu_count > 0 do %>
          <h5 class="card-title">OS stats</h5>
          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="banner-card">
                <h6 class="banner-card-title">
                  Cpu 1 min
                </h6>
                <div class="banner-card-value"><%= Float.ceil(@os_mon.cpu_usage.avg1 / @os_mon.cpu_count, 1) %>%</div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="banner-card">
                <h6 class="banner-card-title">
                  Cpu 5 min
                </h6>
                <div class="banner-card-value"><%= Float.ceil(@os_mon.cpu_usage.avg5 / @os_mon.cpu_count, 1) %>%</div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="banner-card">
                <h6 class="banner-card-title">
                  Cpu 15 min
                </h6>
                <div class="banner-card-value"><%= Float.ceil(@os_mon.cpu_usage.avg15 / @os_mon.cpu_count, 1) %>%</div>
              </div>
            </div>
          </div>
        <% end %>

      </div>

      <!-- Right column -->
      <div class="col-sm-6">
      <!-- Swap component data -->
        <%= if @os_mon.system_mem[:total_swap] not in [0, nil] do %>
          <h5 class="card-title">Memory usage / limits</h5>
          <div class="card progress-section mb-4">
            <%= live_component @socket, BarComponent, id: :swap, percent: percent_swap(@os_mon.system_mem), dir: :left, class: "card-body" do %>
              Swap
               <span class="flex-grow-1"></span>
               <span class="text-right text-muted">
                 <%= swap_description(@os_mon.system_mem) %>
               </span>
            <% end %>
          </div>
        <% end %>

      <!-- Memory data -->
      <!-- Memory component data -->
        <%= if @os_mon.system_mem[:total_memory] not in [0, nil] do %>
          <h5 class="card-title">Memory usage / limits</h5>
          <div class="card progress-section mb-4">
            <%= live_component @socket, BarComponent, id: :memory, percent: percent_memory(@os_mon.system_mem), dir: :left, class: "card-body" do %>
              Memory
               <span class="flex-grow-1"></span>
               <span class="text-right text-muted">
                 <%= memory_description(@os_mon.system_mem) %>
               </span>
            <% end %>
          </div>
        <% else %>
          <h5 class="card-title">
            No Memory data found
          </h5>
        <% end %>

        <%= if @os_mon.system_mem[:total_memory] not in [0, nil] do %>
          <h5 class="card-title">Memory detailed</h5>
          <div class="card progress-section mb-4">
            <div class="card-body disk-usage">
              <%= for {title, percent, color} <- get_memory_bars_data(@os_mon.system_mem) do %>
                <%= live_component @socket, BarComponent, id: title, percent: percent, dir: :left, color: color  do %>
                  <%= title %>
                  <span class="flex-grow-1">
                  </span>
                  <span class="text-right text-muted">
                  </span>
                <% end %>
              <% end %>
            </div>
          </div>
        <% end %>
      <!-- Disk data -->
        <%= if length(@os_mon.disk) > 0 do %>
          <h5 class="card-title">Disk usage / limits</h5>
          <div class="card mb-4">
            <div class="card-body disk-usage">
              <%= for {mountpoint, total, percent} <- hide_disks(@os_mon.disk) do %>
                <%= live_component @socket, BarComponent, id: mountpoint, percent: percent, dir: :left  do %>
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
        <% else %>
          <h5 class="card-title">
            No Disk data found
          </h5>
        <% end %>

      </div>
    </div>
    """
  end

  defp hide_disks(disk_data) do
    disk_data
    |> Enum.filter(fn {mountpoint, _, _} ->
      @hide_disks
      |> Enum.map(fn mp ->
        not (List.to_string(mountpoint) =~ mp)
      end)
      |> Enum.all?()
    end)
  end

  defp get_memory_bars_data(system_memory) do
    @memory_usage_sections
    |> Enum.map(fn {key, name, color} ->
      percentage = percentage(system_memory[key], system_memory[:system_total_memory], 1)

      {name, percentage, color}
    end)
  end

  defp disk_description(percent, kbytes) do
    "#{format_percent(percent)} of #{format_kbytes(kbytes)}"
  end

  defp swap_description(%{free_swap: free, total_swap: total}) do
    "Free #{format_bytes(free)} of #{format_bytes(total)}"
  end

  defp percent_swap(%{free_swap: free, total_swap: total}) do
    (total - free) / total * 100
  end

  defp memory_description(%{free_memory: free, total_memory: total}) do
    "Free #{format_bytes(free)} of #{format_bytes(total)}"
  end

  defp percent_memory(%{free_memory: free, total_memory: total}) do
    (total - free) / total * 100
  end

  defp cpu_usage_sections(cpu_usage) do
    @cpu_usage_sections
    |> Enum.map(fn {key, name, color} ->
      value = cpu_usage[key]

      {key, name, value, color}
    end)
  end

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: live_dashboard_path(socket, :home, node))}
  end

  def handle_info(:refresh, socket) do
    {:noreply,
     socket
     |> assign(:os_mon, SystemInfo.fetch_os_mon_info(socket.assigns.menu.node))}
  end
end
