defmodule Phoenix.LiveDashboard.FieldsCardComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  def normalize_params(params) do
    params
    |> validate_required([:fields])
    |> put_defaults()
  end

  defp validate_required(params, list) do
    case Enum.find(list, &(not Map.has_key?(params, &1))) do
      nil ->
        :ok

      key ->
        raise ArgumentError, "the #{inspect(key)} parameter is expected in fields card component"
    end

    params
  end

  defp put_defaults(params) do
    params
    |> Map.put_new(:title, nil)
    |> Map.put_new(:inner_title, nil)
    |> Map.put_new(:hint, nil)
    |> Map.put_new(:inner_hint, nil)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <%= if @fields && not Enum.empty?(@fields) do %>
      <%= if @title do %>
        <h5 class="card-title">
          <%= @title %>
          <%= if @hint do %>
            <%= hint(do: @hint) %>
          <% end %>
        </h5>
      <% end %>
      <div class="fields-card">
        <div class="card mb-4">
          <div class="card-body rounded pt-3">
            <%= if @inner_title do %>
              <h6 class="card-title">
                <%= @inner_title %>
                <%= if @inner_hint do %>
                  <%= hint(do: @inner_hint) %>
                <% end %>
              </h6>
            <% end %>
            <dl>
            <%= for {k, v} <- @fields do %>
              <dt class="pb-1"><%= k %></dt>
              <dd>
                <textarea class="code-field text-monospace" readonly="readonly" rows="1"><%= v %></textarea>
              </dd>
            <% end %>
            </dl>
          </div>
        </div>
      </div>
    <% end %>
    """
  end
end
