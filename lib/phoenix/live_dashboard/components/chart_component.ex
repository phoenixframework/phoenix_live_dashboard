defmodule Phoenix.LiveDashboard.ChartComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @default_prune_threshold 1_000

  @default_bucket_size 20

  @impl true
  def mount(socket) do
    {:ok, socket, temporary_assigns: [data: []]}
  end

  @impl true
  def update(assigns, socket) do
    {metric, assigns} = Map.pop(assigns, :metric)

    socket =
      if metric do
        kind = chart_kind(metric.__struct__)

        socket
        |> apply_metric(kind, metric)
        |> assign(
          title: chart_title(metric),
          description: metric.description,
          kind: kind,
          label: chart_label(metric),
          tags: Enum.join(metric.tags, "-"),
          unit: chart_unit(metric.unit),
          prune_threshold: prune_threshold(metric)
        )
      else
        socket
      end

    {:ok, assign(socket, assigns)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="col-xl-6 col-xxl-4 col-xxxl-3 charts-col">
      <div id={"chart-#{@id}"} class="card">
        <div class="card-body">
          <div phx-hook="PhxChartComponent" id={"chart-#{@id}-datasets"} hidden>
          <%= for {x, y, z} <- @data do %>
            <span data-x={x || @label} data-y={y} data-z={z}></span>
          <% end %>
          </div>
          <div class="chart"
              id={"chart-ignore-#{@id}"}
              phx-update="ignore"
              data-label={@label}
              data-metric={@kind}
              data-title={@title}
              data-tags={@tags}
              data-unit={@unit}
              data-prune-threshold={@prune_threshold}
              {@metric_attrs}>
          </div>
        </div>
        <%= if @description do %>
          <%= hint do %>
            <%= @description %>
          <% end %>
        <% end %>
      </div>
    </div>
    """
  end

  defp apply_metric(socket, :distribution, metric) do
    assign(socket, :metric_attrs, %{data_bucket_size: bucket_size(metric)})
  end

  defp apply_metric(socket, _kind, _metric) do
    assign(socket, :metric_attrs, %{})
  end

  defp chart_title(metric) do
    "#{Enum.join(metric.name, ".")}#{chart_tags(metric.tags)}"
  end

  defp chart_tags([]), do: ""
  defp chart_tags(tags), do: " (#{Enum.join(tags, "-")})"

  defp chart_kind(Telemetry.Metrics.Counter), do: :counter
  defp chart_kind(Telemetry.Metrics.LastValue), do: :last_value
  defp chart_kind(Telemetry.Metrics.Sum), do: :sum
  defp chart_kind(Telemetry.Metrics.Summary), do: :summary
  defp chart_kind(Telemetry.Metrics.Distribution), do: :distribution

  defp chart_label(%{} = metric) do
    metric.name
    |> List.last()
    |> Phoenix.Naming.humanize()
  end

  defp chart_unit(:byte), do: "bytes"
  defp chart_unit(:kilobyte), do: "KB"
  defp chart_unit(:megabyte), do: "MB"
  defp chart_unit(:nanosecond), do: "ns"
  defp chart_unit(:microsecond), do: "µs"
  defp chart_unit(:millisecond), do: "ms"
  defp chart_unit(:second), do: "s"
  defp chart_unit(:unit), do: ""
  defp chart_unit(unit) when is_atom(unit), do: unit

  defp prune_threshold(metric) do
    prune_threshold =
      metric.reporter_options[:prune_threshold]
      |> validate_positive_integer_or_nil!(:prune_threshold)

    to_string(prune_threshold || @default_prune_threshold)
  end

  defp bucket_size(metric) do
    bucket_size =
      metric.reporter_options[:bucket_size]
      |> validate_positive_integer_or_nil!(:bucket_size)

    to_string(bucket_size || @default_bucket_size)
  end

  defp validate_positive_integer_or_nil!(nil, _field), do: nil

  defp validate_positive_integer_or_nil!(value, field) do
    unless is_integer(value) and value > 0 do
      raise ArgumentError,
            "#{inspect(field)} must be a positive integer, got: #{inspect(value)}"
    end

    value
  end
end
