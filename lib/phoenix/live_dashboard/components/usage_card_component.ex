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
    |> validate_usages([:current, :limit, :dom_sub_id, :title])
    |> put_defaults()
  end

  defp validate_usages(params = %{usages: usages}, mandatory_fields) do
    usages =
      Enum.map(usages, fn usage ->
        validate_required(usage, mandatory_fields, :usages)
        put_usage_defaults(usage)
      end)

    %{params | usages: usages}
  end

  defp validate_required(params, list, parent_key \\ false) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil ->
        :ok

      key ->
        msg =
          if parent_key,
            do: "parent #{inspect(parent_key)} parameter of usage card component",
            else: "usage card component"

        raise ArgumentError, "the #{inspect(key)} parameter is expected in #{msg}"
    end

    params
  end

  defp put_defaults(params) do
    params
    |> Map.put_new(:title, nil)
    |> Map.put_new(:hint, nil)
    |> Map.put_new(:csp_nonces, @csp_nonces)
  end

  defp put_usage_defaults(usage) do
    usage
    |> Map.put_new(:hint, nil)
    |> Map.put_new(:percent, nil)
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
      <div class="card-body card-usage">
        <%= for usage <- @usages do %>
          <%= live_component Phoenix.LiveDashboard.TitleBarComponent, dom_id: "#{@dom_id}-#{usage.dom_sub_id}", class: "py-2", percent: usage.percent, csp_nonces: @csp_nonces do %>
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
