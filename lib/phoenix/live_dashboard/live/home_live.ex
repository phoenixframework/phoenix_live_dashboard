defmodule Phoenix.LiveDashboard.HomeLive do
  use Phoenix.LiveDashboard.Web, :live_view
  alias Phoenix.LiveDashboard.{SystemInfo, SystemLimitComponent}

  @temporary_assigns [system_info: nil, system_usage: nil]

  @versions_sections [
    {:elixir, "Elixir"},
    {:phoenix, "Phoenix"},
    {:dashboard, "Dashboard"}
  ]

  @memory_usage_sections [
    {:atom, "Atoms"},
    {:binary, "Binary"},
    {:code, "Code"},
    {:ets, "ETS"},
    {:process, "Processes"},
    {:other, "Other"}
  ]

  @cpu_usage_sections [
    {:soft_irq, "Soft IRQ"},
    {:hard_irq, "Hard IRQ"},
    {:kernel, "Kernel"},
    {:nice_user, "User nice"},
    {:user, "User"},
    {:steal, "Steal"},
    {:idle, "Idle"},
    {:wait, "Wait"}
  ]

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    socket = assign_defaults(socket, params, session, true)

    %{
      # Read once
      system_info: system_info,
      # Kept forever
      system_limits: system_limits,
      # Updated periodically
      system_usage: system_usage,
      os_mon_info: os_mon_info, 
    } = SystemInfo.fetch_system_info(socket.assigns.menu.node)

    socket =
      assign(socket,
        system_info: system_info,
        system_limits: system_limits,
        system_usage: system_usage,
        os_mon_info: os_mon_info 
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
      <!-- Left column with system/version information -->
      <div class="col-sm-6">
        <h5 class="card-title">System information</h5>

        <div class="card mb-4">
          <div class="card-body rounded">
            <%= @system_info.banner %> [<%= @system_info.system_architecture %>]
          </div>
        </div>

        <!-- Row with colorful version banners -->
        <div class="row">
          <%= for {section, title} <- versions_sections() do %>
            <div class="col mb-4">
              <div class="banner-card background-<%= section %> text-white">
                <h6 class="banner-card-title"><%= title %></h6>
                <div class="banner-card-value"><%= @system_info[:"#{section}_version"] %></div>
              </div>
            </div>
          <% end %>
        </div>

        <div class="row">
          <div class="col-lg-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">Uptime</h6>
              <div class="banner-card-value"><%= format_uptime(@system_usage.uptime) %></div>
            </div>
          </div>

          <div class="col-lg-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">
                Total input
                <%= hint do %>
                  The total number of bytes received through ports/sockets.
                <% end %>
              </h6>
              <div class="banner-card-value"><%= format_bytes(@system_usage.io |> elem(0)) %></div>
            </div>
          </div>

          <div class="col-lg-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">
                Total output
                <%= hint do %>
                  The total number of bytes output to ports/sockets.
                <% end %>
              </h6>
              <div class="banner-card-value"><%= format_bytes(@system_usage.io |> elem(1)) %></div>
            </div>
          </div>
        </div>

        <h5 class="card-title">Run queues</h5>

        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">
                Total
                <%= hint do %>
                  Each core in your machine gets a scheduler to process all instructions within the Erlang VM.
                  Each scheduler has its own queue, which is measured by this number. If this number keeps on
                  growing, it means the machine is overloaded. The queue sizes can also be broken into CPU and IO.
                <% end %>
              </h6>
              <div class="banner-card-value"><%= @system_usage.total_run_queue %></div>
            </div>
          </div>

          <div class="col-md-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">CPU</h6>
              <div class="banner-card-value"><%= @system_usage.cpu_run_queue %></div>
            </div>
          </div>

          <div class="col-md-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">IO</h6>
              <div class="banner-card-value"><%= @system_usage.total_run_queue - @system_usage.cpu_run_queue %></div>
            </div>
          </div>
        </div>

        <h5 class="card-title">System usage / limits</h5>
        <%= live_component @socket, SystemLimitComponent, id: :atoms, usage: @system_usage.atoms, limit: @system_limits.atoms do %>
          Atoms
          <%= hint do %>
            If the number of atoms keeps growing even if the system load is stable, you may have an atom leak in your application.
            You must avoid functions such as <code>String.to_atom/1</code> which can create atoms dynamically.
          <% end %>
        <% end %>

        <%= live_component @socket, SystemLimitComponent, id: :ports, usage: @system_usage.ports, limit: @system_limits.ports do %>
          Ports
          <%= hint do %>
            If the number of ports keeps growing even if the system load is stable, you may have a port leak in your application.
            This means ports are being opened by a parent process that never exits or never closes them.
          <% end %>
        <% end %>

        <%= live_component @socket, SystemLimitComponent, id: :processes, usage: @system_usage.processes, limit: @system_limits.processes do %>
          Processes
          <%= hint do %>
            If the number of processes keeps growing even if the system load is stable, you may have a process leak in your application.
            This means processes are being spawned and they never exit.
          <% end %>
        <% end %>

        <h5 class="card-title">
          Memory
        </h5>
        <div class="card mb-4">
          <div class="card-body memory-usage">
            <div class="progress flex-grow-1 mb-3">
              <%= for {section_key, section_name, section_value} <- memory_usage_sections(@system_usage.memory) do %>
                <div
                  title="<%=section_name %> - <%=percentage(section_value, @system_usage.memory.total, round: true) %>%"
                  class="progress-bar memory-usage-section-<%=section_key %>"
                  role="progressbar"
                  aria-valuenow="<%=section_value %>"
                  aria-valuemin="0"
                  aria-valuemax="<%=@system_usage.memory.total %>"
                  style="width: <%=percentage(section_value, @system_usage.memory.total) %>%">
                </div>
              <% end %>
            </div>
            <div class="memory-usage-legend">
              <div class="memory-usage-legend-entries row flex-column flex-wrap">
                <%= for {section_key, section_name, section_value} <- memory_usage_sections(@system_usage.memory) do %>
                  <div class="col-lg-6 memory-usage-legend-entry d-flex align-items-center py-1 flex-grow-0">
                    <div class="memory-usage-legend-color memory-usage-section-<%=section_key %> mr-2"></div>
                    <span><%=section_name %></span>
                    <span class="flex-grow-1 text-right text-muted">
                      <%= format_bytes(section_value) %>
                    </span>
                  </div>
                <% end %>
              </div>
              <div class="row">
                <div class="col">
                  <div class="memory-usage-total text-center py-1 mt-3">
                    Total usage: <%= format_bytes(@system_usage.memory[:total]) %>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <h5 class="card-title">
          CPU
        </h5>
        <div class="card mb-4">
          <div class="card-body memory-usage">
            <%= for {num_cpu, usage, idle, _} <- [@os_mon_info.cpu_total | @os_mon_info.cpu_per_core] do %>
              <%= format_cpu(num_cpu) %>
              <div class="progress flex-grow-1 mb-3">
                <%= for {name, percent} <- idle ++ usage do %>
                  <div
                  title="<%=name %> - <%= format_percent(percent) %>"
                    class="progress-bar memory-usage-section-<%= format_cpu(num_cpu) %>"
                    role="progressbar"
                    aria-valuenow="<%= Float.ceil(percent, 1) %>"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style="width: <%=percent %>%">
                  </div>
                <% end %>
              </div>
            <% end %>
            <div class="memory-usage-legend">
              <div class="memory-usage-legend-entries row flex-column flex-wrap">
                <% {_, busy, idle, _} = @os_mon_info.cpu_total  %>
                <%= for {section_key, section_name, section_value} <- cpu_usage_sections(busy ++ idle) do %>
                  <div class="col-lg-6 memory-usage-legend-entry d-flex align-items-center py-1 flex-grow-0">
                    <div class="memory-usage-legend-color memory-usage-section-<%= section_key %> mr-2"></div>
                    <span><%=section_name %></span>
                    <span class="flex-grow-1 text-right text-muted">
                      <%= format_percent(section_value) %>
                    </span>
                  </div>
                <% end %>
              </div>
              <div class="row">
                <div class="col">
                  <div class="memory-usage-total text-center py-1 mt-3">
                    Number of OS processes: <%= @os_mon_info.cpu_nprocs %>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h5 class="card-title">OS stats</h5>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">
                Cpu 1 min
              </h6>
              <div class="banner-card-value"><%= Float.ceil(@os_mon_info.cpu_avg1 / 100, 1) %>%</div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">
                Cpu 5 min
              </h6>
              <div class="banner-card-value"><%= Float.ceil(@os_mon_info.cpu_avg5 / 100, 1) %>%</div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">
                Cpu 15 min
              </h6>
              <div class="banner-card-value"><%= Float.ceil(@os_mon_info.cpu_avg15 / 100, 1) %>%</div>
            </div>
          </div>
        </div>
        <h5 class="card-title">Memory usage / limits</h5>

        <%= live_component @socket, SystemLimitComponent, id: :memory, usage: @os_mon_info.system_mem[:free_memory], limit: @os_mon_info.system_mem[:total_memory] do %>
          Memory
          <%= hint do %>
          <% end %>
        <% end %>
        <%= live_component @socket, SystemLimitComponent, id: :swap, usage: @os_mon_info.system_mem[:free_swap], limit: @os_mon_info.system_mem[:total_swap] do %>
          Swap
          <%= hint do %>
          <% end %>
        <% end %>
        <h5 class="card-title">Disk usage / limits</h5>
        <div class="card mb-4">
          <div class="card-body memory-usage">
            <%= for {mountpoint, total, percent} <- @os_mon_info.disk do %>
              <div class="memory-usage-legend-entry d-flex align-items-center py-1 flex-grow-0">
                <span><%= mountpoint %></span>
                <span class="flex-grow-1 text-right text-muted">
                  <%= format_percent(percent) %>
                  <%= "#{format_percent(percent)} of #{format_bytes(total)}" %>
                </span>
              </div>
            <% end %>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp format_cpu(cpu) when is_integer(cpu), do: cpu
  defp format_cpu(cpu) when is_list(cpu), do: "all"
  defp format_cpu(cpu), do: cpu

  defp percentage(value, total, options \\ [])

  defp percentage(_value, 0, _options), do: 0

  defp percentage(value, total, options) do
    percent = Float.round(value / total * 100, 2)

    if options[:round], do: round(percent), else: percent
  end

  defp memory_usage_sections(memory_usage) do
    @memory_usage_sections
    |> Enum.map(fn {section_key, section_name} ->
      value = Map.fetch!(memory_usage, section_key)

      {section_key, section_name, value}
    end)
  end

  defp cpu_usage_sections(cpu_usage) do
    @cpu_usage_sections
    |> Enum.map(fn {section_key, section_name} ->
      value = cpu_usage[section_key]

      {section_key, section_name, value}
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

  defp versions_sections(), do: @versions_sections
end
