defmodule Phoenix.LiveDashboard.UsageCardComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @csp_nonces %{img: nil, script: nil, style: nil}

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  def normalize_params(params) do
    params
    |> validate_required([:usages, :dom_id])
    |> validate_usages([:current, :limit, :sub_dom_id, :title, :percent])
    |> put_defaults()
  end

  defp validate_usages(params = %{usages: usages}, mandatory_fields) do
    usages =
      Enum.map(usages, fn usage ->
        validate_required(usage, mandatory_fields)
        put_usage_defaults(usage)
      end)

    %{params | usages: usages}
  end

  defp validate_required(params, list) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil -> :ok
      key -> raise ArgumentError, "expected #{inspect(key)} parameter to be received"
    end

    params
  end

  defp put_defaults(params) do
    params
    |> Map.put_new(:csp_nonces, @csp_nonces)
  end

  defp put_usage_defaults(usage) do
    usage
    |> Map.put_new(:hint, nil)
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="card">
      <div class="card-body card-usage">
        <%= for usage <- @usages do %>
          <%= live_component @socket, Phoenix.LiveDashboard.TitleBarComponent, dom_id: "#{@dom_id}-#{usage.sub_dom_id}", class: "py-2", percent: usage.percent, csp_nonces: @csp_nonces do %>
            <div>
              <%= usage.title %>
              <%= if(usage.hint) do %>
                <%= hint(do: usage.hint) %>
              <% end %>
            </div>
            <div>
              <small class="text-muted pr-2">
                <%= usage.current %> / <%= usage.limit %>
              </small>
              <%= if usage.percent do %>
                <strong>
                  <%= usage.percent %>%
                </strong>
              <% end %>
            </div>
          <% end %>
        <% end %>
      </div>
    </div>
    """
  end
end
