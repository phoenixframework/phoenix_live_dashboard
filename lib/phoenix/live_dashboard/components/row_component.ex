defmodule Phoenix.LiveDashboard.RowComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  def normalize_params(params) do
    params
    |> validate_required([:components])
    |> put_defaults()
    |> normalize_components()
  end

  defp validate_required(params, list) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil -> :ok
      key -> raise ArgumentError, "expected #{inspect(key)} parameter to be received"
    end

    params
  end

  defp normalize_components(%{components: components} = params) when is_list(components) do
    components_length = length(components)

    if components_length > 0 and components_length < 4 do
      Map.put_new(params, :components_class, div(12, components_length))
    else
      raise ArgumentError,
            "expected :components to have at min 1 compoment and max 3 components, received: {inspect(components_lenght)}"
    end
  end

  defp normalize_components(%{components: components}) do
    raise ArgumentError, "expected :components to be a list, received: #{inspect(components)}"
  end

  defp put_defaults(params) do
    params
    |> Map.put_new(:title, nil)
    |> Map.put_new(:hint, nil)
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
    <div class="row">
      <%= for {component_module, component_params} <- @components do %>
        <%= live_component @socket, component_module, component_params %>
      <% end %>
    </div>
    """
  end
end
