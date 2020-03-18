defmodule Phoenix.LiveDashboard.ChartComponent do
  use Phoenix.LiveDashboard.Web, :live_component

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
          kind: chart_kind(metric.__struct__),
          label: chart_label(metric)
        )
      else
        socket
      end

    {:ok, assign(socket, assigns)}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="col-md-6 charts-col">
      <div id="chart-<%= @id %>" class="card">
        <div phx-hook="PhxChartComponent" id="chart-<%= @id %>--datasets" style="display:none;">
        <%= for {x, y, z} <- @data do %>
          <span data-x="<%= x || @title %>" data-y="<%= y %>" data-z="<%= z %>"></span>
        <% end %>
        </div>
        <div class="chart" phx-update="ignore">
          <canvas id="chart-<%= @id %>--canvas"
          data-label="<%= @label %>"
          data-metric="<%= @kind %>"
          data-title="<%= @title %>"></canvas>
        </div>
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
    |> Kernel.<>("#{humanize_unit(metric.unit)}")
  end

  defp humanize_unit(:byte), do: " (bytes)"
  defp humanize_unit(:kilobyte), do: " (KB)"
  defp humanize_unit(:megabyte), do: " (MB)"
  defp humanize_unit(:nanosecond), do: " (ns)"
  defp humanize_unit(:microsecond), do: " (µs)"
  defp humanize_unit(:millisecond), do: " (ms)"
  defp humanize_unit(:second), do: " s"
  defp humanize_unit(:unit), do: ""
  defp humanize_unit(unit) when is_atom(unit), do: " (#{unit})"
end
