defmodule Phoenix.LiveDashboard.NavBarComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  @impl true
  def update(%{page: page, items: items, nav_param: nav_param} = assigns, socket) do
    socket = assign(socket, assigns)
    current = current_item(page.params, items, nav_param)
    {:ok, assign(socket, :current, current)}
  end

  defp current_item(params, items, nav_param) do
    with %{^nav_param => item} <- params,
         true <- List.keymember?(items, item, 0) do
      item
    else
      _ -> default_item(items)
    end
  end

  defp default_item([{id, _} | _]), do: id

  def normalize_params(params) do
    case Map.fetch(params, :items) do
      :error ->
        raise ArgumentError, "the :items parameter is expected in nav bar component"

      {:ok, no_list} when not is_list(no_list) ->
        msg = ":items parameter must be a list, got: "
        raise ArgumentError, msg <> inspect(no_list)

      {:ok, items} ->
        nav_param = normalize_nav_param(params)

        %{
          items: normalize_items(items),
          nav_param: nav_param,
          extra_params: normalize_extra_params(params, nav_param),
          style: normalize_style(params)
        }
    end
  end

  defp normalize_extra_params(params, nav_param) do
    case Map.fetch(params, :extra_params) do
      :error ->
        []

      {:ok, extra_params_list} when is_list(extra_params_list) ->
        unless Enum.all?(extra_params_list, &(is_binary(&1) or is_atom(&1))) do
          msg = ":extra_params must be a list of strings or atoms, got: "
          raise ArgumentError, msg <> inspect(extra_params_list)
        end

        extra_params_list = Enum.map(extra_params_list, &to_string/1)

        if nav_param in extra_params_list do
          msg = ":extra_params must not contain the :nav_param field name #{inspect(nav_param)}"

          raise ArgumentError, msg
        end

        extra_params_list

      {:ok, extra_params} ->
        msg = ":extra_params must be a list of strings or atoms, got: "
        raise ArgumentError, msg <> inspect(extra_params)
    end
  end

  defp normalize_nav_param(params) do
    case Map.fetch(params, :nav_param) do
      :error ->
        "nav"

      {:ok, nav_param} when is_binary(nav_param) ->
        nav_param

      {:ok, nav_param} when is_atom(nav_param) ->
        Atom.to_string(nav_param)

      {:ok, nav_param} ->
        raise ArgumentError,
              ":nav_param parameter must be an string or atom, got: #{inspect(nav_param)}"
    end
  end

  defp normalize_style(params) do
    style = Map.get(params, :style, :pills)

    unless style in [:pills, :bar] do
      raise ArgumentError, ":style must be either :pills or :bar"
    end

    style
  end

  def normalize_items(items) do
    Enum.map(items, &normalize_item/1)
  end

  defp normalize_item({id, item}) when is_atom(id) and is_list(item) do
    normalize_item({Atom.to_string(id), item})
  end

  defp normalize_item({id, item}) when is_binary(id) and is_list(item) do
    {id,
     item
     |> validate_item_render()
     |> validate_item_name()
     |> normalize_item_method()}
  end

  defp normalize_item(invalid_item) do
    msg = ":items must be [{string() | atom(), [name: string(), render: fun()], got: "

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
    ~H"""
    <div>
      <div class="row">
        <div class="container">
          <ul class={"nav nav-#{@style} mt-n2 mb-4"}>
            <%= for {id, item} <- @items do %>
              <li class="nav-item">
                <%= render_item_link(@socket, @page, item, @current, @nav_param, id, @extra_params) %>
              </li>
            <% end %>
          </ul>
        </div>
      </div>
      <%= render_item_content(@page, @items, @current) %>
    </div>
    """
  end

  defp render_item_link(socket, page, item, current, nav_param, id, extra_params) do
    params_to_keep = for {key, value} <- page.params, key in extra_params, do: {key, value}

    path =
      Phoenix.LiveDashboard.PageBuilder.live_dashboard_path(
        socket,
        page.route,
        page.node,
        page.params,
        [{nav_param, id} | params_to_keep]
      )

    class = "nav-link#{if current == id, do: " active"}"

    case item[:method] do
      :patch -> live_patch(item[:name], to: path, class: class)
      :redirect -> live_redirect(item[:name], to: path, class: class)
    end
  end

  defp render_item_content(page, items, id) do
    {_, opts} = List.keyfind(items, id, 0)
    render_content(page, opts[:render])
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
