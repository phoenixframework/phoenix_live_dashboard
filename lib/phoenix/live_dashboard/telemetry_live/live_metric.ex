defmodule Phoenix.LiveDashboard.LiveMetric do
  # A LiveComponent for rendering a `Telemetry.Metrics` chart on the dashboard.
  @moduledoc false
  use Phoenix.LiveComponent
  alias Phoenix.LiveDashboard.Chart

  @timeseries ~w(summary distribution)a
  @gauges ~w(last_value counter sum)a

  @impl true
  def render(assigns) do
    ~L"""
    <div class="phx-dashboard-col">
      <div id="<%= @chart.id %>-datasets" phx-hook="PhxLiveMetric" style="display:none;"><%= render_datasets(assigns) %></div>
      <div class="chart" phx-update="ignore">
        <canvas id="<%= @chart.id %>"
         data-label="<%= @chart.label %>"
         data-type="<%= chartjs_type(@chart) %>"
         data-title="<%= @chart.id %>"></canvas>
      </div>
    </div>
    """
  end

  @impl true
  def update(%{chart: %Chart{} = chart}, socket) do
    {:ok, assign(socket, chart: chart, datasets: [])}
  end

  def update(%{data: points}, socket) when is_list(points) do
    %{chart: chart, datasets: datasets} = socket.assigns

    {:ok,
     assign(
       socket,
       :datasets,
       Enum.reduce(points, datasets, fn point, datasets ->
         %{x: label, y: measurement, z: received_at} = point

         # get the dataset value for the given label
         {_, current_value} = List.keyfind(datasets, label, 0, {label, 0})

         List.keystore(
           datasets,
           label,
           0,
           {label, next_value(chart.kind, measurement, current_value, received_at)}
         )
       end)
     )}
  end

  defp next_value(:counter, _, current_value, _), do: current_value + 1
  defp next_value(:last_value, measurement, _, _), do: measurement
  defp next_value(:sum, measurement, current_value, _), do: measurement + current_value
  defp next_value(:summary, measurement, _, received_at), do: {received_at, measurement}

  @doc false
  def chartjs_type(%Chart{kind: kind}), do: chartjs_type(kind)
  def chartjs_type(kind) when kind in @timeseries, do: "line"
  def chartjs_type(_), do: "doughnut"

  @doc false
  def render_datasets(%{chart: %Chart{kind: kind}} = assigns) when kind in @timeseries do
    ~L"""
    <%= for {label, {x, y}} <- @datasets do %>
      <span class="dataset" data-label="<%= label %>" data-x="<%= x %>" data-y="<%= y %>"></span>
    <% end %>
    """
  end

  def render_datasets(%{chart: %Chart{kind: kind}} = assigns) when kind in @gauges do
    ~L"""
    <%= for {label, value} <- @datasets do %>
      <span class="dataset" data-label="<%= label %>" data-value="<%= value %>"></span>
    <% end %>
    """
  end
end
