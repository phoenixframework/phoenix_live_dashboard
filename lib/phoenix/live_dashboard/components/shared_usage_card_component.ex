defmodule Phoenix.LiveDashboard.SharedUsageCardComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @csp_nonces %{img: nil, script: nil, style: nil}

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  def normalize_params(params) do
    params
    |> validate_required([:usages, :total_data, :total_legend, :total_usage, :dom_id])
    |> validate_usages()
    |> put_defaults()
  end

  defp validate_usages(params = %{usages: usages}) do
    normalized_usages =
      Enum.map(usages, fn usage ->
        validate_required(usage, [:data, :dom_sub_id], :usages)
        put_usage_defaults(usage)
      end)

    %{params | usages: normalized_usages}
  end

  defp validate_required(params, list, parent_key \\ false) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil ->
        :ok

      key ->
        msg =
          if parent_key,
            do: "parent #{inspect(parent_key)} parameter of shared usage card component",
            else: "shared usage card component"

        raise ArgumentError, "the #{inspect(key)} parameter is expected in #{msg}"
    end

    params
  end

  defp put_usage_defaults(params) do
    params
    |> Map.put_new(:title, nil)
  end

  defp put_defaults(params) do
    params
    |> Map.put_new(:title, nil)
    |> Map.put_new(:hint, nil)
    |> Map.put_new(:inner_title, nil)
    |> Map.put_new(:inner_hint, nil)
    |> Map.put_new(:csp_nonces, @csp_nonces)
    |> Map.put_new(:total_formatter, &"#{&1} %")
  end

  @impl true
  def render(assigns) do
    ~H"""
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
              <div class="progress color-bar-progress flex-grow-1 mb-3">
                <span class="color-bar-progress-title"><%= usage.title %></span>
                <%= for {{name, value, color, _desc}, index} <- Enum.with_index(usage.data) do %>
                  <style nonce={@csp_nonces.style}>#<%= "cpu-#{usage.dom_sub_id}-progress-#{index}" %>{width:<%= value %>%}</style>
                  <div
                  title={"#{name} - #{format_percent(value)}"}
                  class={"progress-bar color-bar-progress-bar bg-gradient-#{color}"}
                  role="progressbar"
                  aria-valuenow={maybe_round(value)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  data-name={name}
                  data-empty={empty?(value)}
                  id={"cpu-#{usage.dom_sub_id}-progress-#{index}"}>
                  </div>
                <% end %>
              </div>
            </div>
          <% end %>
          <div class="color-bar-legend">
            <div class="row">
            <%= for {name, value, color, hint} <- @total_data do %>
              <div class="col-lg-6 d-flex align-items-center py-1 flex-grow-0 color-bar-legend-entry" data-name={name}>
                <div class={"color-bar-legend-color bg-#{color} mr-2"}></div>
                <span><%= name %> <%= hint && hint(do: hint) %></span>
                <span class="flex-grow-1 text-right text-muted"><%= @total_formatter.(value) %></span>
              </div>
              <% end %>
            </div>
          </div>
          <div class="resource-usage-total text-center py-1 mt-3">
            <%= @total_legend %> <%= @total_usage %>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp maybe_round(num) when is_integer(num), do: num
  defp maybe_round(num), do: Float.ceil(num, 1)

  defp empty?(value) when is_number(value) and value > 0, do: false
  defp empty?(_), do: true
end
