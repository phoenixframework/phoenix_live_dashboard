defmodule Phoenix.LiveDashboard.ChartComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @default_prune_threshold 1_000

  @impl true
  def mount(socket) do
    {:ok, socket, temporary_assigns: [data: []]}
  end

  @impl true
  def update(assigns, socket) do
    {metric, assigns} = Map.pop(assigns, :metric)

    socket =
      if metric do
        assign(socket,
          title: chart_title(metric),
          description: metric.description,
          kind: chart_kind(metric.__struct__),
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
    ~L"""
    <div class="col-xl-6 col-xxl-4 col-xxxl-3 charts-col">
      <div id="chart-<%= @id %>" class="card">
        <div class="card-body">
          <div phx-hook="PhxChartComponent" id="chart-<%= @id %>--datasets" style="display:none;">
          <%= for {x, y, z} <- @data do %>
            <span data-x="<%= x || @label %>" data-y="<%= y %>" data-z="<%= z %>"></span>
          <% end %>
          </div>
          <div class="chart"
              id="chart-ignore-<%= @id %>"
              phx-update="ignore"
              data-label="<%= @label %>"
              data-metric="<%= @kind %>"
              data-title="<%= @title %>"
              data-tags="<%= @tags %>"
              data-unit="<%= @unit %>"
              data-prune-threshold="<%= @prune_threshold %>">
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

  defp chart_title(metric) do
    "#{Enum.join(metric.name, ".")}#{chart_tags(metric.tags)}"
  end

  defp chart_tags([]), do: ""
  defp chart_tags(tags), do: " (#{Enum.join(tags, "-")})"

  defp chart_kind(Telemetry.Metrics.Counter), do: :counter
  defp chart_kind(Telemetry.Metrics.LastValue), do: :last_value
  defp chart_kind(Telemetry.Metrics.Sum), do: :sum
  defp chart_kind(Telemetry.Metrics.Summary), do: :summary

  defp chart_kind(Telemetry.Metrics.Distribution),
    do: raise(ArgumentError, "LiveDashboard does not yet support distribution metrics")

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
      |> validate_prune_threshold()

    to_string(prune_threshold || @default_prune_threshold)
  end

  defp validate_prune_threshold(nil), do: nil

  defp validate_prune_threshold(value) do
    unless is_integer(value) and value > 0 do
      raise ArgumentError,
            "expected :prune_threshold to be a positive integer, got: #{inspect(value)}"
    end

    value
  end
end
