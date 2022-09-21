defmodule Phoenix.LiveDashboard.RowComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  def normalize_params(params) do
    params
    |> validate_required([:components])
    |> normalize_components()
  end

  defp validate_required(params, list) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil -> :ok
      key -> raise ArgumentError, "the #{inspect(key)} parameter is expected in row component"
    end

    params
  end

  defp normalize_components(%{components: components} = params) when is_list(components) do
    components_length = length(components)

    if components_length > 0 and components_length < 4 do
      params
    else
      raise ArgumentError,
            ":components must have at least 1 component and at most 3 components, got: " <>
              inspect(components_length)
    end
  end

  defp normalize_components(%{components: components}) do
    raise ArgumentError, ":components must be a list, got: " <> inspect(components)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="row">
      <%= for {component_module, component_params} <- @components do %>
        <%= live_component component_module, Map.put(component_params, :page, @page) %>
      <% end %>
    </div>
    """
  end
end
