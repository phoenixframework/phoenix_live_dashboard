defmodule Phoenix.LiveDashboard.ChartComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok,
     socket
     |> stream_configure(:data, dom_id: &data_dom_id/1)
     |> stream(:data, [])}
  end

  defp data_dom_id(_), do: "unused"

  @impl true
  def update(assigns, socket) do
    {data, assigns} = Map.pop(assigns, :data, [])
    socket = assign(socket, assigns) |> normalize_assigns!(data)
    {:ok, socket}
  end

  defp normalize_assigns!(socket, data) do
    %{assigns: assigns} = socket
    validate_positive_integer_or_nil!(assigns[:bucket_size], :bucket_size)
    validate_positive_integer_or_nil!(assigns[:prune_threshold], :prune_threshold)
    normalize_data(socket, data)
  end

  defp validate_positive_integer_or_nil!(nil, _field), do: nil

  defp validate_positive_integer_or_nil!(value, field) do
    unless is_integer(value) and value > 0 do
      msg = "#{inspect(field)} must be a positive integer, got: #{inspect(value)}"
      raise ArgumentError, msg
    end
  end

  defp normalize_data(socket, data) do
    label = socket.assigns.label

    data
    |> Enum.map(fn {x, y, z} -> {x || label, y, z} end)
    |> Enum.reduce(socket, fn elem, socket -> stream_insert(socket, :data, elem) end)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class={chart_size(@full_width)}>
      <div id={"chart-#{@id}"} class="card">
        <div class="card-body">
          <!-- We don't add a phx-update="stream" because js expects only new data -->
          <div phx-hook="PhxChartComponent" id={"chart-#{@id}-datasets"} hidden>
            <span :for={{_id, {x, y, z}} <- @streams.data} data-x={x} data-y={y} data-z={z}></span>
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
