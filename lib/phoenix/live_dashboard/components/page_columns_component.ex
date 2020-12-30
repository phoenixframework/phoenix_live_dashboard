defmodule Phoenix.LiveDashboard.PageColumnsComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  def normalize_params(params) do
    params
    |> validate_required([:columns])
    |> normalize_columns()
  end

  defp validate_required(params, list) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil -> :ok
      key -> raise ArgumentError, "expected #{inspect(key)} parameter to be received"
    end

    params
  end

  defp normalize_columns(%{columns: columns} = params) when is_list(columns) do
    columns_length = length(columns)

    if columns_length > 0 and columns_length < 4 do
      Map.put_new(params, :columns_class, div(12, columns_length))
    else
      raise ArgumentError,
            "expected :columns to have at min 1 compoment and max 3 columns, received: {inspect(columns_lenght)}"
    end
  end

  defp normalize_columns(%{columns: columns}) do
    raise ArgumentError, "expected :columns to be a list, received: #{inspect(columns)}"
  end

  @impl true
  def render(assigns) do
    ~L"""
      <%= for column_components <- @columns do %>
        <div class="col-sm-<%= @columns_class %> mb-4">
          <%= render_component(column_components, assigns) %>
        </div>
      <% end %>
    """
  end

  defp render_component(components, assigns) when is_list(components) do
    ~L"""
    <%= for {component_module, component_params} <- components do %>
      <%= live_component @socket, component_module, component_params %>
    <% end %>
    """
  end

  defp render_component({component_module, component_params}, assigns) do
    ~L"""
      <%= live_component @socket, component_module, component_params %>
    """
  end
end
