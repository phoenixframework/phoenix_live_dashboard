defmodule Phoenix.LiveDashboard.MetricsLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.ChartComponent

  @impl true
  def mount(params, %{"metrics" => {mod, fun}} = session, socket) do
    all_metrics = apply(mod, fun, [])
    metrics_per_group = Enum.group_by(all_metrics, &group_name/1)

    group = params["group"]
    metrics = metrics_per_group[group]

    socket =
      socket
      |> assign_defaults(params, session)
      |> assign(group: group, groups: Map.keys(metrics_per_group))

    cond do
      group && is_nil(metrics) ->
        {:ok, push_redirect(socket, to: live_dashboard_path(socket, :metrics, node()))}

      metrics && connected?(socket) ->
        Phoenix.LiveDashboard.TelemetryListener.listen(socket.assigns.menu.node, metrics)
        {:ok, assign(socket, metrics: Enum.with_index(metrics))}

      true ->
        {:ok, assign(socket, metrics: nil)}
    end
  end

  defp group_name(metric) do
    to_string(metric.reporter_options[:group] || hd(metric.name))
  end

  @impl true
  def render(assigns) do
    ~L"""
    <ul class="nav nav-pills mb-4 charts-nav">
      <%= for group <- @groups do %>
        <li class="nav-item">
          <%= live_redirect("#{inspect(group)} metrics",
                to: live_dashboard_path(@socket, :metrics, @menu.node, [group]),
                class: "nav-link #{if @group == group, do: "active"}") %>
        </li>
      <% end %>
    </ul>

    <%= if @metrics do %>
      <div class="phx-dashboard-metrics-grid row">
      <%= for {metric, id} <- @metrics do %>
        <%= live_component @socket, ChartComponent, id: id, metric: metric %>
      <% end %>
      </div>
    <% end %>
    """
  end

  @impl true
  def handle_info({:telemetry, entries}, socket) do
    for {id, label, measurement, time} <- entries do
      data = [{label, measurement, DateTime.from_unix!(time, :millisecond)}]
      send_update(ChartComponent, id: id, data: data)
    end

    {:noreply, socket}
  end

  def handle_info({:node_redirect, node}, socket) do
    args = if group = socket.assigns.group, do: [group], else: []
    {:noreply, push_redirect(socket, to: live_dashboard_path(socket, :metrics, node, args))}
  end
end
