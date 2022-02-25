defmodule Phoenix.LiveDashboard.ColumnsComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  def normalize_params(params) do
    params
    |> validate_required([:components])
    |> normalize_columns()
  end

  defp validate_required(params, list) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil -> :ok
      key -> raise ArgumentError, "the #{inspect(key)} parameter is expected in columns component"
    end

    params
  end

  defp normalize_columns(%{components: components} = params) when is_list(components) do
    columns_length = length(components)

    if columns_length > 0 and columns_length < 4 do
      Map.put_new(params, :columns_class, div(12, columns_length))
    else
      raise ArgumentError,
            ":components must have at least 1 component and at most 3 components, got: " <>
              inspect(columns_length)
    end
  end

  defp normalize_columns(%{components: components}) do
    raise ArgumentError, ":components must be a list, got: #{inspect(components)}"
  end

  @impl true
  def render(assigns) do
    ~H"""
      <%= for column_components <- @components do %>
        <div class={"col-sm-#{@columns_class} mb-4 flex-column d-flex"}>
          <%= for {component_module, component_params} <- List.wrap(column_components) do %>
            <%= live_component component_module, component_params %>
          <% end %>
        </div>
      <% end %>
    """
  end
end
