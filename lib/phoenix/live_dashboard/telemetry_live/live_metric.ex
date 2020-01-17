defmodule Phoenix.LiveDashboard.LiveMetric do
  # A LiveComponent for rendering a `Telemetry.Metrics` chart on the dashboard.
  @moduledoc false
  use Phoenix.LiveComponent
  alias Phoenix.LiveDashboard.MetricConversion

  @type datasets :: list()

  @type t :: %__MODULE__{
          id: String.t(),
          datasets: datasets,
          data_label: nil | String.t(),
          metric: nil | String.t(),
          unit: nil | Telemetry.Metrics.unit()
        }

  @enforce_keys [:id]
  defstruct [:id, :data_label, :metric, :unit, datasets: []]

  @timeseries ~w(summary distribution)
  @gauges ~w(last_value counter sum)

  @doc """
  Creates a `Phoenix.TelemetryDashboard.LiveMetric` struct
  from a Telemetry Metrics struct.
  """
  def from_telemetry(%struct{} = metric) do
    %__MODULE__{
      id: chart_id(metric),
      datasets: datasets(metric),
      data_label: MetricConversion.label(metric),
      metric: MetricConversion.metric(struct),
      unit: metric.unit
    }
  end

  @doc """
  Returns the DOM ID for a metric on the Telemetry Dashboard.
  """
  def chart_id(%struct{} = metric) do
    [metric.name, metric.tags, MetricConversion.metric(struct)]
    |> Enum.flat_map(&List.wrap/1)
    |> Enum.join("-")
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div phx-hook="LiveMetric" class="phx-dashboard-col">
      <div style="display:none;"><%= render_datasets(assigns) %></div>
      <div class="chart" phx-update="ignore">
        <canvas id="<%= @id %>"
         data-label="<%= @chart.data_label %>"
         data-type="<%= chartjs_type(@chart) %>"
         data-title="<%= @id %>"></canvas>
      </div>
    </div>
    """
  end

  @doc false
  def chartjs_type(%__MODULE__{metric: kind}), do: chartjs_type(kind)
  def chartjs_type(kind) when kind in @timeseries, do: "line"
  def chartjs_type(_), do: "doughnut"

  @doc false
  def render_datasets(%{chart: %__MODULE__{metric: "summary"}} = assigns) do
    ~L"""
    <%= for {label, {x, y}} <- @chart.datasets do %>
      <span class="dataset" data-label="<%= label %>" data-x="<%= x %>" data-y="<%= y %>"></span>
    <% end %>
    """
  end

  def render_datasets(%{chart: %__MODULE__{metric: kind}} = assigns) when kind in @gauges do
    ~L"""
    <%= for {label, value} <- @chart.datasets do %>
      <span class="dataset" data-label="<%= label %>" data-value="<%= value %>"></span>
    <% end %>
    """
  end

  # Customize initial datasets per metric
  defp datasets(%_struct{} = _metric), do: []
end
