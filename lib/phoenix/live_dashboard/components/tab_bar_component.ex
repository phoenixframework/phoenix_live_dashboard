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

  def validate_params(params) do
    case Map.fetch(params, :tabs) do
      :error ->
        {:error, "expected ':tabs' parameter"}

      {:ok, no_list} when not is_list(no_list) ->
        {:error, "expected ':tabs' parameter to be a list"}

      {:ok, tabs} ->
        validate_tabs(tabs)
    end
  end

  defp validate_tabs(tabs) do
    msg = "expected :tabs to be [{atom(), keyword() | map()}], received: "

    Enum.find_value(tabs, :ok, fn
      {atom, list_or_map} when is_atom(atom) and (is_list(list_or_map) or is_map(list_or_map)) ->
        with :ok <- validate_tab(list_or_map), do: nil

      invalid ->
        {:error, msg <> inspect(invalid)}
    end)
  end

  defp validate_tab(tab) do
    with :ok <- validate_tab_render(tab),
         :ok <- validate_tab_name(tab),
         do: :ok
  end

  defp validate_tab_render(tab) do
    case Access.fetch(tab, :render) do
      :error -> {:error, ":render parameter not found in tab: #{inspect(tab)}"}
      {:ok, render} when is_function(render, 1) -> :ok
      {:ok, {component, args}} when is_atom(component) and is_list(args) -> :ok
      {:ok, _invalid} -> {:error, "invalid :render parameter in tab: #{inspect(tab)}"}
    end
  end

  defp validate_tab_name(tab) do
    case Access.fetch(tab, :name) do
      :error -> {:error, ":name parameter not found in tab: #{inspect(tab)}"}
      {:ok, string} when is_binary(string) -> :ok
      {:ok, _invalid} -> {:error, "invalid :name parameter in tab: #{inspect(tab)}"}
    end
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

  @impl true
  def render(assigns) do
    ~L"""
    <div>
      <div class="row">
        <div class="container">
          <ul class="nav nav-tabs mb-4 charts-nav">
            <%= for {id, tab} <- @tabs do %>
              <li class="nav-item">
                <%= live_redirect(Access.fetch!(tab, :name),
                      to: live_dashboard_path(@socket, @page, tab: id),
                      class: "nav-link #{if @current == id, do: "active"}") %>
              </li>
            <% end %>
          </ul>
        </div>
      </div>
      <%= render_content(@socket, @page, @tabs, @current) %>
    </div>
    """
  end

  defp render_content(socket, page, tabs, current) do
    tabs
    |> Keyword.fetch!(current)
    |> Access.fetch!(:render)
    |> case do
      {component, component_assigns} ->
        component_assigns = Keyword.put(component_assigns, :page, page)
        live_component(socket, component, component_assigns)

      # Needed for the metrics page, should be removed soon
      fun when is_function(fun, 1) ->
        fun.(socket)
    end
  end
end
