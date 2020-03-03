defmodule Phoenix.LiveDashboard.ChartComponent do
  # A LiveComponent for rendering a `Telemetry.Metrics` chart on the dashboard.
  @moduledoc false
  use Phoenix.LiveComponent

  @enforce_keys [:id, :kind, :label, :metric]
  defstruct [:id, :kind, :label, :metric]

  @type t :: %__MODULE__{
          id: String.t(),
          kind: atom,
          label: nil | String.t()
        }

  @impl true
  def mount(socket) do
    {:ok, assign(socket, data: []), temporary_assigns: [data: []]}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div id="<%= @chart.id %>" class="phx-dashboard-metrics-col">
      <div phx-hook="PhxChartComponent" id="<%= @chart.id %>--datasets" style="display:none;">
      <%= for %{x: x, y: y, z: z} <- @data do %>
        <span data-x="<%= x %>" data-y="<%= y %>" data-z="<%= z %>"></span>
      <% end %>
      </div>
      <div class="chart" phx-update="ignore">
        <canvas id="<%= @chart.id %>--canvas"
         data-label="<%= @chart.label %>"
         data-metric="<%= @chart.kind %>"
         data-title="<%= @chart.id %>"></canvas>
      </div>
    </div>
    """
  end
end
