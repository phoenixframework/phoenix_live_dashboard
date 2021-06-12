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
        raise ArgumentError, "the :items parameter is expected in nav bar component"

      {:ok, no_list} when not is_list(no_list) ->
        msg = ":items parameter must be a list, got: "
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
    msg = ":items must be [{atom(), [name: string(), render: fun()], got: "

    raise ArgumentError, msg <> inspect(invalid_item)
  end

  defp validate_item_render(item) do
    case Keyword.fetch(item, :render) do
      :error ->
        msg = ":render parameter must be in item: #{inspect(item)}"
        raise ArgumentError, msg

      {:ok, render} when is_function(render, 0) ->
        item

      {:ok, _invalid} ->
        msg =
          ":render parameter in item must be a function that returns a component, got: #{inspect(item)}"

        raise ArgumentError, msg
    end
  end

  defp validate_item_name(item) do
    case Keyword.fetch(item, :name) do
      :error ->
        msg = ":name parameter must be in item: #{inspect(item)}"
        raise ArgumentError, msg

      {:ok, string} when is_binary(string) ->
        item

      {:ok, _invalid} ->
        msg = ":name parameter must be a string, got: #{inspect(item)}"
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
        msg = ":method parameter in item must contain value of :patch or :redirect, got: "
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
      <%= render_content(@page, @items[@current][:render]) %>
    </div>
    """
  end

  defp render_item_link(socket, page, item, current, id) do
    # The nav ignores all params, except the current node if any
    path =
      Phoenix.LiveDashboard.PageBuilder.live_dashboard_path(
        socket,
        page.route,
        page.node,
        page.params,
        nav: id
      )

    class = "nav-link#{if current == id, do: " active"}"

    case item[:method] do
      :patch -> live_patch(item[:name], to: path, class: class)
      :redirect -> live_redirect(item[:name], to: path, class: class)
    end
  end

  defp render_content(page, component_or_fun) do
    case component_or_fun do
      {component, component_assigns} ->
        live_component(component, Map.put(component_assigns, :page, page))

      fun when is_function(fun, 0) ->
        render_content(page, fun.())

      # TODO: Remove me once we port metrics
      %Phoenix.LiveView.Rendered{} = other ->
        other
    end
  end
end
