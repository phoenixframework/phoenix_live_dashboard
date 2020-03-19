defmodule Phoenix.LiveDashboard.HomeLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.SystemInfo

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
          <div class="col mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">Uptime</h6>
              <div class="banner-card-value"><%= SystemInfo.format_uptime(@system_usage.uptime) %></div>
            </div>
          </div>

          <div class="col mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">Total input</h6>
              <div class="banner-card-value"><%= SystemInfo.format_bytes(@system_usage.io |> elem(0)) %></div>
            </div>
          </div>

          <div class="col mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">Total output</h6>
              <div class="banner-card-value"><%= SystemInfo.format_bytes(@system_usage.io |> elem(1)) %></div>
            </div>
          </div>
        </div>

        <h5 class="card-title">Run queues</h5>

        <div class="row">
          <div class="col mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">Total</h6>
              <div class="banner-card-value"><%= @system_usage.total_run_queue %></div>
            </div>
          </div>

          <div class="col mb-4">
            <div class="banner-card">
              <h6 class="banner-card-title">CPU</h6>
              <div class="banner-card-value"><%= @system_usage.cpu_run_queue %></div>
            </div>
          </div>

          <div class="col mb-4">
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
                  </div>
                  <div>
                    <small class="text-muted pr-2">
                      <%= @system_usage[section] %> / <%= @system_limits[section] %>
                    </small>
                    <strong>
                      <%= used(:atoms, @system_usage, @system_limits) %>%
                    </strong>
                  </div>
                </div>

                <div class="progress flex-grow-1 mt-2">
                  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: <%= used(:atoms, @system_usage, @system_limits) %>%"></div>
                </div>
              </section>
            </div>
          </div>
        <% end %>

        <h5 class="card-title">Memory</h5>

        <div class="card mb-4">
          <div class="card-body">
            <%= inspect(@system_usage.memory) %>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp used(attr, usage, limit) do
    trunc(Map.fetch!(usage, attr) / Map.fetch!(limit, attr) * 100)
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
