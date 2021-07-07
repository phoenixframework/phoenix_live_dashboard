defmodule Phoenix.LiveDashboard.CardComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  def normalize_params(params) do
    params
    |> validate_required([:value])
    |> put_defaults()
  end

  defp validate_required(params, list) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil -> :ok
      key -> raise ArgumentError, "the #{inspect(key)} parameter is expected in card component"
    end

    params
  end

  defp put_defaults(params) do
    params
    |> Map.put_new(:class, [])
    |> Map.put_new(:title, nil)
    |> Map.put_new(:inner_title, nil)
    |> Map.put_new(:hint, nil)
    |> Map.put_new(:inner_hint, nil)
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
    <div class={"banner-card mt-auto #{Enum.join(@class, " ")}"}>
      <%= if @inner_title do %>
        <h6 class="banner-card-title">
          <%= @inner_title %>
          <%= if @inner_hint do %>
            <%= hint(do: @inner_hint) %>
          <% end %>
        </h6>
      <% end %>
      <div class="banner-card-value"><%= @value %></div>
    </div>
    """
  end
end
