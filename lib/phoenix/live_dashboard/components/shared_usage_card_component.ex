defmodule Phoenix.LiveDashboard.SharedUsageCardComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.{
    ColorBarComponent,
    ColorBarLegendComponent
  }

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  def normalize_params(params) do
    params
    |> validate_required([:usages, :total_data, :total_legend, :total_usage, :csp_nonces, :dom_id])
    # |> validate_usages()
    |> put_defaults()
  end

  # defp validate_usages(params = %{usages: usages}) do
  #   Enum.each(usages, &validate_required(&1, [:usage, :limit, :percent, :title]))

  #   params
  # end

  defp validate_required(params, list) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil -> :ok
      key -> raise ArgumentError, "expected #{inspect(key)} parameter to be received"
    end

    params
  end

  defp put_defaults(params) do
    params
    |> Map.put_new(:title, nil)
    |> Map.put_new(:hint, nil)
    |> Map.put_new(:inner_title, nil)
    |> Map.put_new(:inner_hint, nil)
    |> Map.put_new(:total_formatter, &"#{&1} %")
  end

  @impl true
  def render(assigns) do
    ~L"""
    <%= if @title do %>
      <h5 class="card-title">
        <%= @title %>
        <%= if @hint do %>
          <%= hint(do: @hint) %>
        <% end %>
      </h5>
    <% end %>
    <div class="card">
      <%= if @inner_title do %>
        <h5 class="card-title">
          <%= @inner_title %>
          <%= if @inner_hint do %>
            <%= hint(do: @inner_hint) %>
          <% end %>
        </h5>
      <% end %>
      <div class="card-body">
        <div phx-hook="PhxColorBarHighlight" id="cpu-color-bars">
          <%= for usage <- @usages do %>
            <div class="flex-grow-1 mb-3">
              <%= live_component @socket, ColorBarComponent, dom_id: "cpu-#{usage.dom_sub_id}", data: usage.data, title: usage.title, csp_nonces: @csp_nonces %>
            </div>
          <% end %>
          <%= live_component @socket, ColorBarLegendComponent, data: @total_data, formatter: @total_formatter %>
          <div class="resource-usage-total text-center py-1 mt-3">
            <%= @total_legend %> <%= @total_usage %>
          </div>
        </div>
      </div>
    </div>
    """
  end
end
