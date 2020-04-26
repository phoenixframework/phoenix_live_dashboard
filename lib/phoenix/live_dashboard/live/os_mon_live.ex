defmodule Phoenix.LiveDashboard.OsMonLive do
  use Phoenix.LiveDashboard.Web, :live_view
  alias Phoenix.LiveDashboard.{SystemInfo, BarComponent}

  @temporary_assigns [system_info: nil, system_usage: nil]

  @cpu_usage_sections [
    {:kernel, "Kernel", "orange"},
    {:user, "User", "purple"},
    {:nice_user, "User nice", "green"},
    # {:steal, "Steal", "dark-gray"},
    {:soft_irq, "Soft IRQ", "blue"},
    {:hard_irq, "Hard IRQ", "yellow"},
    {:idle, "Idle", "dark-gray"}
    # {:wait, "Wait", ""}
  ]
  @memory_usage_sections [
    {:in_use_memory, "In use", "purple"},
    {:buffered_memory, "Buffered", "green"},
    {:cached_memory, "Cached", "orange"},
    {:free_memory, "Free", "dark-gray"}
  ]

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    socket = assign_defaults(socket, params, session, true)

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

    socket =
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
              <%= for {_ , name, value, color} <- cpu_usage_sections(usage) do %>
                <div
                title="CPU<%= num_cpu%>: <%=name %> - <%= format_percent(value) %>"
                class="progress-bar resource-usage-section-1 bg-gradient-<%= color %>"
                role="progressbar"
                aria-valuenow="<%= Float.ceil(value, 1) %>"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: <%= value %>%">
                </div>
                <% end %>
              </div>
            <% end %>
            <div class="resource-usage-legend">
              <div class="resource-usage-legend-entries-3 row flex-column flex-wrap">
                <%= for {_ , name, value, color} <- cpu_usage_sections(@cpu_total) do %>
                  <div class="col-lg-6 resource-usage-legend-entry-3 d-flex align-items-center py-1 flex-grow-0">
                    <div class="resource-usage-legend-color bg-<%= color %> mr-2"></div>
                    <span><%= name %></span>
                    <span class="flex-grow-1 text-right text-muted">
                      <%= format_percent(value) %>
                    </span>
                  </div>
                <% end %>
              </div>
              <div class="row">
                <div class="col">
                  <div class="resource-usage-total text-center py-1 mt-3">
                    Number of OS processes: <%= @cpu_nprocs %>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cpu total -->
        <h5 class="card-title">
          Total CPU
        </h5>
        <div class="card mb-4">
          <div class="card-body resource-usage">
              <div class="progress flex-grow-1 mb-3">
              <%= for {_ , name, value, color} <- cpu_usage_sections(@cpu_total) do %>
                <div
                title="<%=name %> - <%= format_percent(value) %>"
                class="progress-bar resource-usage-section-1 bg-gradient-<%= color %>"
                role="progressbar"
                aria-valuenow="<%= Float.ceil(value, 1) %>"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: <%= value %>%">
                </div>
                <% end %>
              </div>
            <div class="resource-usage-legend">
              <div class="resource-usage-legend-entries-3 row flex-column flex-wrap">
                <%= for {_ , name, value, color} <- cpu_usage_sections(@cpu_total) do %>
                  <div class="col-lg-6 resource-usage-legend-entry-3 d-flex align-items-center py-1 flex-grow-0">
                    <div class="resource-usage-legend-color bg-<%= color %> mr-2"></div>
                    <span><%= name %></span>
                    <span class="flex-grow-1 text-right text-muted">
                      <%= format_percent(value) %>
                    </span>
                  </div>
                <% end %>
              </div>
              <div class="row">
                <div class="col">
                  <div class="resource-usage-total text-center py-1 mt-3">
                    Number of OS processes: <%= @cpu_nprocs %>
                  </div>
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
            <div class="progress flex-grow-1 mb-3">
            <%= for {_ , name, value, color} <- memory_usage_sections(@system_mem) do %>
              <div
                title="<%=name %> - <%= format_percent(value) %>"
                class="progress-bar resource-usage-section-<%= value %> bg-gradient-<%= color %>"
                role="progressbar"
                aria-valuenow="<%= value %>"
                aria-valuemin="0"
                aria-valuemax="100"
                style="width: <%= value %>%">
              </div>
              <% end %>
            </div>
            <div class="resource-usage-legend">
              <div class="resource-usage-legend-entries-2 row flex-column flex-wrap">
                <%= for {_ , section_name, section_value, color} <- memory_usage_sections(@system_mem) do %>
                  <div class="col-lg-6 resource-usage-legend-entry-2 d-flex align-items-center py-1 flex-grow-0">
                    <div class="resource-usage-legend-color bg-<%= color %> mr-2"></div>
                    <span><%=section_name %></span>
                    <span class="flex-grow-1 text-right text-muted">
                      <%= format_percent(section_value) %>
                    </span>
                  </div>
                <% end %>
              </div>
              <div class="row">
                <div class="col">
                  <div class="resource-usage-total text-center py-1 mt-3">
                    Total memory: <%= format_bytes(@system_mem[:total_memory]) %>
                  </div>
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

  def get_percent(part, total) do
    Float.ceil(part / total * 100, 1)
  end

  def disk_description(percent, kbytes) do
    "#{format_percent(percent)} of #{format_k_bytes(kbytes)}"
  end

  def swap_description(%{free_swap: free, total_swap: total}) do
    "free #{format_bytes(free)} of #{format_bytes(total)}"
  end

  def percent_swap(%{free_swap: free, total_swap: total}) do
    (total - free) / total * 100
  end

  def memory_description(%{free_memory: free, total_memory: total}) do
    "free #{format_bytes(free)} of #{format_bytes(total)}"
  end

  def percent_memory(%{free_memory: free, total_memory: total}) do
    (total - free) / total * 100
  end

  defp memory_usage_sections(mem_usage) do
    @memory_usage_sections
    |> Enum.map(fn {section_key, section_name, color} ->
      value = get_percent(mem_usage[section_key], mem_usage[:total_memory])

      {section_key, section_name, value, color}
    end)
  end

  defp cpu_usage_sections(cpu_usage) do
    @cpu_usage_sections
    |> Enum.map(fn {section_key, section_name, color} ->
      value = cpu_usage[section_key]

      {section_key, section_name, value, color}
    end)
  end

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: live_dashboard_path(socket, :home, node))}
  end

  def handle_info(:refresh, socket) do
    socket
    |> assign(system_usage: SystemInfo.fetch_system_usage(socket.assigns.menu.node))
    |> assign(os_mon_info: SystemInfo.fetch_os_mon_info(socket.assigns.menu.node))

    {:noreply, socket}
  end
end
