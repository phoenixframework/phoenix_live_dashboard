defmodule Phoenix.LiveDashboard.MetricsPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder, refresher?: false

  @menu_text "Metrics"

  @impl true
  def mount(params, %{metrics: {mod, fun}, metrics_history: history}, socket) do
    all_metrics = apply(mod, fun, [])
    metrics_per_nav = Enum.group_by(all_metrics, &nav_name/1)

    nav = params["nav"]
    metrics = metrics_per_nav[nav]
    {first_nav, _} = Enum.at(metrics_per_nav, 0, {nil, nil})

    socket = assign(socket, items: Map.keys(metrics_per_nav))

    cond do
      nav && is_nil(metrics) ->
        to = live_dashboard_path(socket, socket.assigns.page, nav: first_nav)
        {:ok, push_navigate(socket, to: to)}

      metrics && connected?(socket) ->
        Phoenix.LiveDashboard.TelemetryListener.listen(socket.assigns.page.node, metrics)
        send_history_for_metrics(metrics, history, nav)
        {:ok, assign(socket, metrics: Enum.with_index(metrics), nav: nav)}

      first_nav && is_nil(nav) ->
        to = live_dashboard_path(socket, socket.assigns.page, nav: first_nav)
        {:ok, push_navigate(socket, to: to)}

      true ->
        {:ok, assign(socket, metrics: nil, nav: nav)}
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

  def menu_link(%{metrics: nil}, _) do
    {:disabled, @menu_text, "https://hexdocs.pm/phoenix_live_dashboard/metrics.html"}
  end

  def menu_link(_, _) do
    {:ok, @menu_text}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_nav_bar id="metrics_nav_bar" page={@page}>
      <:item :for={item <- @items} name={item} label={format_nav_name(item)} method="redirect">
        <div :if={@metrics} class="phx-dashboard-metrics-grid row">
          <%= for {metric, id} <- @metrics do %>
            <.live_metric_chart id={id(id, @nav)} metric={metric} />
          <% end %>
        </div>
      </:item>
    </.live_nav_bar>
    """
  end

  @doc false
  attr :id, :string,
    required: true,
    doc: "Because is a stateful `Phoenix.LiveComponent` an unique id is needed."

  attr :metric, :any, required: true, doc: "Metric to be represented in the chart"

  def live_metric_chart(%{id: id, metric: metric}) do
    assigns = assigns_from_metric(id, metric)

    ~H"""
    <Phoenix.LiveDashboard.PageBuilder.live_chart {assigns} />
    """
  end

  def assigns_from_metric(id, metric) do
    kind = chart_kind(metric.__struct__)

    %{
      id: id,
      title: chart_title(metric),
      hint: metric.description,
      kind: kind,
      label: chart_label(metric),
      tags: metric.tags,
      prune_threshold: prune_threshold(metric),
      unit: chart_unit(metric.unit),
      bucket_size: bucket_size(kind, metric)
    }
  end

  defp chart_title(metric) do
    "#{Enum.join(metric.name, ".")}#{chart_title_tags(metric.tags)}"
  end

  defp chart_title_tags([]), do: ""
  defp chart_title_tags(tags), do: " (#{Enum.join(tags, "-")})"

  defp chart_label(%{} = metric) do
    metric.name
    |> List.last()
    |> Phoenix.Naming.humanize()
  end

  defp chart_kind(Telemetry.Metrics.Counter), do: :counter
  defp chart_kind(Telemetry.Metrics.LastValue), do: :last_value
  defp chart_kind(Telemetry.Metrics.Sum), do: :sum
  defp chart_kind(Telemetry.Metrics.Summary), do: :summary
  defp chart_kind(Telemetry.Metrics.Distribution), do: :distribution

  defp chart_unit(:byte), do: "bytes"
  defp chart_unit(:kilobyte), do: "KB"
  defp chart_unit(:megabyte), do: "MB"
  defp chart_unit(:nanosecond), do: "ns"
  defp chart_unit(:microsecond), do: "µs"
  defp chart_unit(:millisecond), do: "ms"
  defp chart_unit(:second), do: "s"
  defp chart_unit(:unit), do: ""
  defp chart_unit(unit) when is_atom(unit), do: Atom.to_string(unit)

  @default_prune_threshold 1_000
  defp prune_threshold(metric) do
    metric.reporter_options[:prune_threshold] || @default_prune_threshold
  end

  defp bucket_size(:distribution, metric), do: normalize_bucket_size(metric)
  defp bucket_size(_kind, _metric), do: nil

  @default_bucket_size 20
  defp normalize_bucket_size(metric) do
    metric.reporter_options[:bucket_size] || @default_bucket_size
  end

  defp send_updates_for_entries(entries, nav) do
    for {id, label, measurement, time} <- entries do
      data = [{label, measurement, time}]
      send_data_to_chart(id(id, nav), data)
    end
  end

  defp send_updates_for_entries_in_chunks(entries, nav) do
    ## Batch historical data up into chunks of 500 to reduce the number
    ## of messages sent over the wire, but keep them small enough that
    ## the client still feels responsive.
    entries
    |> Enum.group_by(
      fn {id, _, _, _} -> id end,
      fn {_, label, measurement, time} -> {label, measurement, time} end
    )
    |> Enum.each(fn {id, data} ->
      data
      |> Enum.chunk_every(500)
      |> Enum.each(fn chunk -> send_data_to_chart(id(id, nav), chunk) end)
    end)
  end

  defp id(id, nav), do: "#{nav}-#{id}"

  @impl true
  def handle_info({:telemetry, entries}, socket) do
    send_updates_for_entries(entries, socket.assigns.nav)
    {:noreply, socket}
  end

  defp send_history_for_metrics(_, nil, _), do: :noop

  defp send_history_for_metrics(metrics, history, nav) do
    for {metric, id} <- Enum.with_index(metrics) do
      metric
      |> history_for(id, history)
      |> send_updates_for_entries_in_chunks(nav)
    end
  end

  defp history_for(metric, id, {module, function, opts}) do
    history = apply(module, function, [metric | opts])

    for %{label: label, measurement: measurement, time: time} <- history do
      {id, label, measurement, time}
    end
  end
end
