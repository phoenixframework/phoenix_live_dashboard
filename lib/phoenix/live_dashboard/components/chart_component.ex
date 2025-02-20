defmodule Phoenix.LiveDashboard.ChartComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket, temporary_assigns: [data: []]}
  end

  @impl true
  def update(assigns, socket) do
    socket = assign(socket, assigns)
    validate_assigns!(socket.assigns)
    {:ok, socket}
  end

  defp validate_assigns!(assigns) do
    validate_positive_integer_or_nil!(assigns[:bucket_size], :bucket_size)
    validate_positive_integer_or_nil!(assigns[:prune_threshold], :prune_threshold)
    :ok
  end

  defp validate_positive_integer_or_nil!(nil, _field), do: nil

  defp validate_positive_integer_or_nil!(value, field) do
    unless is_integer(value) and value > 0 do
      raise ArgumentError, "#{inspect(field)} must be a positive integer, got: #{inspect(value)}"
    end

    value
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class={chart_size(@full_width)}>
      <div id={"chart-#{@id}"} class="card">
        <div class="card-body">
          <div phx-hook="PhxChartComponent" id={"chart-#{@id}-datasets"} hidden>
            <span :for={{x, y, z} <- @data} data-x={x || @label} data-y={y} data-z={z}></span>
          </div>
          <div
            class="chart"
            id={"chart-ignore-#{@id}"}
            phx-update="ignore"
            data-label={@label}
            data-metric={@kind}
            data-title={@title}
            data-tags={Enum.join(@tags, "-")}
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

  defp chart_size(_full_width = true), do: "col-12 charts-col"
  defp chart_size(_full_width = false), do: "col-xl-6 col-xxl-4 col-xxxl-3 charts-col"

  defp bucket_size(nil), do: %{}

  defp bucket_size(integer) when is_integer(integer),
    do: %{"data-bucket-size" => to_string(integer)}
end
