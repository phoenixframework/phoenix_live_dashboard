defmodule Phoenix.LiveDashboard.NavBarComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  @impl true
  def update(assigns, socket) do
    %{page: page, items: items} = assigns
    current = current_item(page.params, items)
    {:ok, assign(socket, items: items, current: current, page: page)}
  end

  defp current_item(params, items) do
    with %{"nav" => item} <- params,
         true <- Enum.any?(items, fn {id, _} -> Atom.to_string(id) == item end) do
      String.to_existing_atom(item)
    else
      _ -> default_item(items)
    end
  end

  defp default_item([{id, _} | _]) do
    id
  end

  def normalize_params(params) do
    case Map.fetch(params, :items) do
      :error ->
        raise ArgumentError, "expected :items parameter to be received"

      {:ok, no_list} when not is_list(no_list) ->
        msg = "expected :items parameter to be a list, received: "
        raise ArgumentError, msg <> inspect(no_list)

      {:ok, items} ->
        %{items: normalize_items(items)}
    end
  end

  def normalize_items(items) do
    Enum.map(items, &normalize_item/1)
  end

  defp normalize_item({id, item}) when is_atom(id) and is_list(item) do
    {id,
     item
     |> validate_item_render()
     |> validate_item_name()
     |> normalize_item_method()}
  end

  defp normalize_item(invalid_item) do
    msg = "expected :items to be [{atom(), [name: string(), render: component()], received: "

    raise ArgumentError, msg <> inspect(invalid_item)
  end

  defp validate_item_render(item) do
    case Keyword.fetch(item, :render) do
      :error ->
        msg = "expected :render parameter to be received in item: #{inspect(item)}"
        raise ArgumentError, msg

      {:ok, render} when is_function(render, 0) ->
        item

      {:ok, {component, args}} when is_atom(component) and is_map(args) ->
        item

      {:ok, _invalid} ->
        msg = "expected :render parameter in item to be a component, received: #{inspect(item)}"
        raise ArgumentError, msg
    end
  end

  defp validate_item_name(item) do
    case Keyword.fetch(item, :name) do
      :error ->
        msg = "expected :name parameter to be received in item: #{inspect(item)}"
        raise ArgumentError, msg

      {:ok, string} when is_binary(string) ->
        item

      {:ok, _invalid} ->
        msg = "expected :name parameter in item to be a string, received: #{inspect(item)}"
        raise ArgumentError, msg
    end
  end

  defp normalize_item_method(item) do
    case Keyword.fetch(item, :method) do
      :error ->
        [method: :patch] ++ item

      {:ok, method} when method in [:patch, :redirect] ->
        item

      {:ok, method} ->
        msg = "expected :method parameter in item to be :patch or :redirect, received: "
        raise ArgumentError, msg <> inspect(method)
    end
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div>
      <div class="row">
        <div class="container">
          <ul class="nav nav-pills mt-n2 mb-4">
            <%= for {id, item} <- @items do %>
              <li class="nav-item">
                <%= render_item_link(@socket, @page, item, @current, id) %>
              </li>
            <% end %>
          </ul>
        </div>
      </div>
      <%= render_content(@socket, @page, @items, @current) %>
    </div>
    """
  end

  defp render_item_link(socket, page, item, current, id) do
    params = maybe_put([nav: id], :info, page.params[:info])
    path = live_dashboard_path(socket, page.route, page.node, params)
    class = "nav-link#{if current == id, do: " active"}"

    case item[:method] do
      :patch -> live_patch(item[:name], to: path, class: class)
      :redirect -> live_redirect(item[:name], to: path, class: class)
    end
  end

  defp maybe_put(keyword, _key, nil), do: keyword
  defp maybe_put(keyword, key, value), do: [{key, value} | keyword]

  defp render_content(socket, page, items, current) do
    case items[current][:render] do
      {component, component_assigns} ->
        live_component(socket, component, Map.put(component_assigns, :page, page))

      # Needed for the metrics page, should be removed soon
      fun when is_function(fun, 0) ->
        fun.()
    end
  end
end
