defmodule Phoenix.LiveDashboard.ChartComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket, temporary_assigns: [data: []]}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="col-xl-6 col-xxl-4 col-xxxl-3 charts-col">
      <div id={"chart-#{@id}"} class="card">
        <div class="card-body">
          <div phx-hook="PhxChartComponent" id={"chart-#{@id}-datasets"} hidden>
          <span :for={{x, y, z} <- @data} data-x={x || @label} data-y={y} data-z={z}></span>
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
              {bucket_size(@bucket_size)}
            >
          </div>
        </div>
        <Phoenix.LiveDashboard.PageBuilder.hint :if={@hint} text={@hint} />
      </div>
    </div>
    """
  end

  defp bucket_size(nil), do: %{}
  defp bucket_size(integer) when is_integer(integer), do: %{data_bucket_size: to_string(integer)}
end
