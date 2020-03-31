defmodule Phoenix.LiveDashboard.HomeLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.SystemInfo
  import Phoenix.LiveDashboard.HintHelpers

  @temporary_assigns [system_info: nil, system_usage: nil]

  @system_limits_sections [
    {:atoms, "Atoms"},
    {:ports, "Ports"},
    {:processes, "Processes"}
  ]

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
              <h6 class="banner-card-title">Total input</h6>
              <div class="banner-card-value"><%= SystemInfo.format_bytes(@system_usage.io |> elem(0)) %></div>
            </div>
          </div>

          <div class="col-lg-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">Total output</h6>
              <div class="banner-card-value"><%= SystemInfo.format_bytes(@system_usage.io |> elem(1)) %></div>
            </div>
          </div>
        </div>

        <h5 class="card-title">Run queues</h5>

        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">Total</h6>
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

        <%= for {section, title} <- system_limits_sections() do %>
          <div class="card progress-section mb-4">
            <div class="card-body">
              <section>
                <div class="d-flex justify-content-between">
                  <div>
                    <%= title %>
                    <%= hint("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lectus turpis, tristique quis pretium sagittis, ultricies et leo. Integer tempus rhoncus lacinia.") %>
                  </div>
                  <div>
                    <small class="text-muted pr-2">
                      <%= @system_usage[section] %> / <%= @system_limits[section] %>
                    </small>
                    <strong>
                      <%= used(section, @system_usage, @system_limits) %>%
                    </strong>
                  </div>
                </div>

                <div class="progress flex-grow-1 mt-2">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="<%= used(section, @system_usage, @system_limits) %>"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style="width: <%= used(section, @system_usage, @system_limits) %>%"
                  >
                  </div>
                </div>
              </section>
            </div>
          </div>
        <% end %>

        <h5 class="card-title">Memory
          <%=hint("Lorem ipsum") %>
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

  defp used(attr, usage, limit) do
    trunc(Map.fetch!(usage, attr) / Map.fetch!(limit, attr) * 100)
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

  defp system_limits_sections(), do: @system_limits_sections
  defp versions_sections(), do: @versions_sections
end
