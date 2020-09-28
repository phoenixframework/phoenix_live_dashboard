defmodule Phoenix.LiveDashboard.MetricsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder, refresher?: false

  alias Phoenix.LiveDashboard.ChartComponent

  @menu_text "Metrics"

  @impl true
  def mount(params, %{"metrics" => {mod, fun}, "metrics_history" => history}, socket) do
    all_metrics = apply(mod, fun, [])
    metrics_per_nav = Enum.group_by(all_metrics, &nav_name/1)

    nav = params["nav"]
    metrics = metrics_per_nav[nav]
    {first_nav, _} = Enum.at(metrics_per_nav, 0, {nil, nil})

    socket = assign(socket, items: Map.keys(metrics_per_nav))

    cond do
      nav && is_nil(metrics) ->
        {:ok, push_redirect(socket, to: live_dashboard_path(socket, :metrics, node(), []))}

      metrics && connected?(socket) ->
        Phoenix.LiveDashboard.TelemetryListener.listen(socket.assigns.page.node, metrics)
        send_history_for_metrics(metrics, history)
        {:ok, assign(socket, metrics: Enum.with_index(metrics))}

      first_nav && is_nil(nav) ->
        to = live_dashboard_path(socket, :metrics, socket.assigns.page.node, nav: first_nav)
        {:ok, push_redirect(socket, to: to)}

      true ->
        {:ok, assign(socket, metrics: nil)}
    end
  end

  defp nav_name(metric) do
    to_string(metric.reporter_options[:nav] || hd(metric.name))
  end

  defp format_nav_name("vm"), do: "VM"
  defp format_nav_name(nav), do: Phoenix.Naming.camelize(nav)

  @impl true
  def menu_link(_, %{dashboard_running?: false}) do
    :skip
  end

  def menu_link(%{"metrics" => nil}, _) do
    {:disabled, @menu_text, "https://hexdocs.pm/phoenix_live_dashboard/metrics.html"}
  end

  def menu_link(_, _) do
    {:ok, @menu_text}
  end

  @impl true
  def render_page(assigns) do
    items =
      for name <- assigns.items do
        {String.to_atom(name),
         name: format_nav_name(name), render: render_metrics(assigns), method: :redirect}
      end

    nav_bar(items: items)
  end

  def render_metrics(assigns) do
    fn ->
      ~L"""
      <%= if @metrics do %>
        <div class="phx-dashboard-metrics-grid row">
        <%= for {metric, id} <- @metrics do %>
          <%= live_component @socket, ChartComponent, id: id, metric: metric %>
        <% end %>
        </div>
      <% end %>
      """
    end
  end

  defp send_updates_for_entries(entries) do
    for {id, label, measurement, time} <- entries do
      data = [{label, measurement, time}]
      send_update(ChartComponent, id: id, data: data)
    end
  end

  @impl true
  def handle_info({:telemetry, entries}, socket) do
    send_updates_for_entries(entries)
    {:noreply, socket}
  end

  defp send_history_for_metrics(_, nil), do: :noop

  defp send_history_for_metrics(metrics, history) do
    for {metric, id} <- Enum.with_index(metrics) do
      metric
      |> history_for(id, history)
      |> send_updates_for_entries()
    end
  end

  defp history_for(metric, id, {module, function, opts}) do
    history = apply(module, function, [metric | opts])

    for %{label: label, measurement: measurement, time: time} <- history do
      {id, label, measurement, time}
    end
  end
end
