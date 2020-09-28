defmodule Phoenix.LiveDashboard.TabBarComponent do
  @moduledoc false
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  @impl true
  def update(assigns, socket) do
    %{page: page, tabs: tabs} = assigns
    current = current_tab(page.params, tabs)
    {:ok, assign(socket, tabs: tabs, current: current, page: page)}
  end

  defp current_tab(params, tabs) do
    with %{"tab" => tab} <- params,
         true <- Enum.any?(tabs, fn {id, _} -> Atom.to_string(id) == tab end) do
      String.to_existing_atom(tab)
    else
      _ -> default_tab(tabs)
    end
  end

  defp default_tab([{id, _} | _]) do
    id
  end

  def normalize_params(params) do
    case Map.fetch(params, :tabs) do
      :error ->
        raise ArgumentError, "expected :tabs parameter to be received"

      {:ok, no_list} when not is_list(no_list) ->
        msg = "expected :tabs parameter to be a list, received: "
        raise ArgumentError, msg <> inspect(no_list)

      {:ok, tabs} ->
        %{tabs: normalize_tabs(tabs)}
    end
  end

  def normalize_tabs(tabs) do
    Enum.map(tabs, &normalize_tab/1)
  end

  defp normalize_tab({id, tab}) when is_atom(id) and is_list(tab) do
    {id,
     tab
     |> validate_tab_render()
     |> validate_tab_name()
     |> normalize_tab_method()}
  end

  defp normalize_tab(invalid_tab) do
    msg = "expected :tabs to be [{atom(), [name: string(), render: component()], received: "

    raise ArgumentError, msg <> inspect(invalid_tab)
  end

  defp validate_tab_render(tab) do
    case Keyword.fetch(tab, :render) do
      :error ->
        msg = "expected :render parameter to be received in tab: #{inspect(tab)}"
        raise ArgumentError, msg

      {:ok, render} when is_function(render, 0) ->
        tab

      {:ok, {component, args}} when is_atom(component) and is_map(args) ->
        tab

      {:ok, _invalid} ->
        msg = "expected :render parameter in tab to be a component, received: #{inspect(tab)}"
        raise ArgumentError, msg
    end
  end

  defp validate_tab_name(tab) do
    case Keyword.fetch(tab, :name) do
      :error ->
        msg = "expected :name parameter to be received in tab: #{inspect(tab)}"
        raise ArgumentError, msg

      {:ok, string} when is_binary(string) ->
        tab

      {:ok, _invalid} ->
        msg = "expected :name parameter in tab to be a string, received: #{inspect(tab)}"
        raise ArgumentError, msg
    end
  end

  defp normalize_tab_method(tab) do
    case Keyword.fetch(tab, :method) do
      :error ->
        [method: :patch] ++ tab

      {:ok, method} when method in [:patch, :redirect] ->
        tab

      {:ok, method} ->
        msg = "expected :method parameter in tab to be :patch or :redirect, received: "
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
            <%= for {id, tab} <- @tabs do %>
              <li class="nav-item">
                <%= render_tab_link(@socket, @page, tab, @current, id) %>
              </li>
            <% end %>
          </ul>
        </div>
      </div>
      <%= render_content(@socket, @page, @tabs, @current) %>
    </div>
    """
  end

  defp render_tab_link(socket, page, tab, current, id) do
    params = maybe_put([tab: id], :info, page.params[:info])
    path = live_dashboard_path(socket, page.route, page.node, params)
    class = "nav-link#{if current == id, do: " active"}"

    case tab[:method] do
      :patch -> live_patch(tab[:name], to: path, class: class)
      :redirect -> live_redirect(tab[:name], to: path, class: class)
    end
  end

  defp maybe_put(keyword, _key, nil), do: keyword
  defp maybe_put(keyword, key, value), do: [{key, value} | keyword]

  defp render_content(socket, page, tabs, current) do
    case tabs[current][:render] do
      {component, component_assigns} ->
        live_component(socket, component, Map.put(component_assigns, :page, page))

      # Needed for the metrics page, should be removed soon
      fun when is_function(fun, 0) ->
        fun.()
    end
  end
end
