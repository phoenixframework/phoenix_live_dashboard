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

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    socket = assign_defaults(socket, params, session, true)

    %{
      # Read once
      system_info: system_info,
      # Kept forever
      system_limits: system_limits,
      # Updated periodically
      system_usage: system_usage
    } = SystemInfo.fetch_info(socket.assigns.menu.node)

    socket =
      assign(socket,
        system_info: system_info,
        system_limits: system_limits,
        system_usage: system_usage
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
              <div class="banner-card-value"><%= SystemInfo.format_uptime(@system_usage.uptime) %></div>
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
              <div class="banner-card-value"><%= SystemInfo.format_bytes(@system_usage.io |> elem(0)) %></div>
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
              <div class="banner-card-value"><%= SystemInfo.format_bytes(@system_usage.io |> elem(1)) %></div>
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
      </div>

      <!-- Right column containing system usage information -->
      <div class="col-sm-6">
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
                      <%=SystemInfo.format_bytes(section_value) %>
                    </span>
                  </div>
                <% end %>
              </div>

              <div class="row">
                <div class="col">
                  <div class="memory-usage-total text-center py-1 mt-3">
                    Total usage: <%=SystemInfo.format_bytes(@system_usage.memory[:total]) %>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end

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

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: live_dashboard_path(socket, :home, node))}
  end

  def handle_info(:refresh, socket) do
    {:noreply, assign(socket, system_usage: SystemInfo.fetch_usage(socket.assigns.menu.node))}
  end

  defp versions_sections(), do: @versions_sections
end
