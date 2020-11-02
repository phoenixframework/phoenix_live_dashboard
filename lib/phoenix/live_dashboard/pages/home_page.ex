defmodule Phoenix.LiveDashboard.HomePage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder

  alias Phoenix.LiveDashboard.{
    SystemInfo,
    CardUsageComponent,
    ColorBarComponent,
    ColorBarLegendComponent
  }

  @temporary_assigns [system_info: nil, system_usage: nil]

  @versions_sections [
    {:elixir, "Elixir"},
    {:phoenix, "Phoenix"},
    {:dashboard, "Dashboard"}
  ]

  @memory_usage_sections [
    {:atom, "Atoms", "green"},
    {:binary, "Binary", "blue"},
    {:code, "Code", "purple"},
    {:ets, "ETS", "yellow"},
    {:process, "Processes", "orange"},
    {:other, "Other", "dark-gray"}
  ]

  @menu_text "Home"

  @impl true
  def mount(_params, session, socket) do
    %{
      # Read once
      system_info: system_info,
      environment: environment,
      # Kept forever
      system_limits: system_limits,
      # Updated periodically
      system_usage: system_usage
    } = SystemInfo.fetch_system_info(socket.assigns.page.node, session["env_keys"])

    socket =
      assign(socket,
        system_info: system_info,
        system_limits: system_limits,
        system_usage: system_usage,
        environment: environment
      )

    {:ok, socket, temporary_assigns: @temporary_assigns}
  end

  @impl true
  def menu_link(_, _) do
    {:ok, @menu_text}
  end

  @impl true
  def render_page(_assigns), do: raise("this page is special cased to use render/2 instead")

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
              <div class="banner-card bg-<%= section %> text-white">
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

        <%= if @environment do %>
          <div class="environment-card">
            <h5 class="card-title">Environment</h5>

            <div class="card mb-4">
              <div class="card-body rounded pt-3">
                <dl>
                <%= for {k, v} <- @environment do %>
                  <dt class="pb-1"><%= k %></dt>
                  <dd>
                    <textarea class="code-field text-monospace" readonly="readonly" rows="1"><%= v %></textarea>
                  </dd>
                <% end %>
                </dl>
              </div>
            </div>
          </div>
        <% end %>
      </div>

      <!-- Right column containing system usage information -->
      <div class="col-sm-6">
        <h5 class="card-title">System limits</h5>

        <%= live_component @socket, CardUsageComponent, dom_id: "usage-atoms", usage: @system_usage.atoms, limit: @system_limits.atoms, csp_nonces: @csp_nonces do %>
          Atoms
          <%= hint do %>
            If the number of atoms keeps growing even if the system load is stable, you may have an atom leak in your application.
            You must avoid functions such as <code>String.to_atom/1</code> which can create atoms dynamically.
          <% end %>
        <% end %>

        <%= live_component @socket, CardUsageComponent, dom_id: "usage-ports", usage: @system_usage.ports, limit: @system_limits.ports, csp_nonces: @csp_nonces do %>
          Ports
          <%= hint do %>
            If the number of ports keeps growing even if the system load is stable, you may have a port leak in your application.
            This means ports are being opened by a parent process that never exits or never closes them.
          <% end %>
        <% end %>

        <%= live_component @socket, CardUsageComponent, dom_id: "usage-processes", usage: @system_usage.processes, limit: @system_limits.processes, csp_nonces: @csp_nonces do %>
          Processes
          <%= hint do %>
            If the number of processes keeps growing even if the system load is stable, you may have a process leak in your application.
            This means processes are being spawned and they never exit.
          <% end %>
        <% end %>

        <h5 class="card-title">
          Memory
        </h5>

        <div class="card resource-usage mb-4">
          <div class="card-body" phx-hook="PhxColorBarHighlight" id="memory-color-bars">
            <%= live_component @socket, ColorBarComponent, data: memory_usage_sections_percent(@system_usage.memory, @system_usage.memory.total), csp_nonces: @csp_nonces, dom_id: "system_usage_memory_total" %>
            <%= live_component @socket, ColorBarLegendComponent, data: memory_usage_sections(@system_usage.memory), formatter: &format_bytes(&1) %>
            <div class="row">
              <div class="col">
                <div class="resource-usage-total text-center py-1 mt-3">
                  Total usage: <%= format_bytes(@system_usage.memory[:total]) %>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    """
  end

  defp memory_usage_sections_percent(memory_usage, total) do
    memory_usage
    |> memory_usage_sections()
    |> Enum.map(fn {n, value, c, desc} ->
      {n, percentage(value, total), c, desc}
    end)
  end

  defp memory_usage_sections(memory_usage) do
    Enum.map(@memory_usage_sections, fn {section_key, section_name, color} ->
      value = Map.fetch!(memory_usage, section_key)
      {section_name, value, color, nil}
    end)
  end

  @impl true
  def handle_refresh(socket) do
    {:noreply,
     assign(socket, system_usage: SystemInfo.fetch_system_usage(socket.assigns.page.node))}
  end

  defp versions_sections(), do: @versions_sections
end
