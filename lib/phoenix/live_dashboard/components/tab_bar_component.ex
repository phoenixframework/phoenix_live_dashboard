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
        {:error, "expected :tabs parameter to be received"}

      {:ok, no_list} when not is_list(no_list) ->
        msg = "expected :tabs parameter to be a list, received: "
        {:error, msg <> inspect(no_list)}

      {:ok, tabs} ->
        with {:ok, tabs} <- normalize_tabs(tabs) do
          {:ok, %{tabs: tabs}}
        end
    end
  end

  def normalize_tabs(tabs) do
    Enum.reduce_while(tabs, [], fn tab, tabs ->
      case normalize_tab(tab) do
        {:ok, tab} -> {:cont, [tab | tabs]}
        {:error, error} -> {:halt, {:error, error}}
      end
    end)
    |> case do
      {:error, error} -> {:error, error}
      tabs when is_list(tabs) -> {:ok, Enum.reverse(tabs)}
    end
  end

  defp normalize_tab({id, tab}) when is_atom(id) and is_list(tab) do
    with :ok <- validate_tab_render(tab),
         :ok <- validate_tab_name(tab),
         {:ok, tab} <- normalize_tab_method(tab),
         do: {:ok, {id, tab}}
  end

  defp normalize_tab(invalid_tab) do
    msg = "expected :tabs to be [{atom(), [name: string(), render: component()], received: "

    {:error, msg <> inspect(invalid_tab)}
  end

  defp validate_tab_render(tab) do
    case Keyword.fetch(tab, :render) do
      :error ->
        {:error, "expected :render parameter to be received in tab: #{inspect(tab)}"}

      {:ok, render} when is_function(render, 0) ->
        :ok

      {:ok, {component, args}} when is_atom(component) and is_list(args) ->
        :ok

      {:ok, _invalid} ->
        {:error, "expected :render parameter in tab to be a component, received: #{inspect(tab)}"}
    end
  end

  defp validate_tab_name(tab) do
    case Keyword.fetch(tab, :name) do
      :error ->
        {:error, "expected :name parameter to be received in tab: #{inspect(tab)}"}

      {:ok, string} when is_binary(string) ->
        :ok

      {:ok, _invalid} ->
        {:error, "expected :name parameter in tab to be a string, received: #{inspect(tab)}"}
    end
  end

  defp normalize_tab_method(tab) do
    case Keyword.fetch(tab, :method) do
      :error ->
        {:ok, tab ++ [method: :patch]}

      {:ok, method} when method in [:patch, :redirect] ->
        {:ok, tab}

      {:ok, method} ->
        msg = "expected :method parameter in tab to be :patch or :redirect, received: "
        {:error, msg <> inspect(method)}
    end
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
    path = live_dashboard_path(socket, page, tab: id)
    class = "nav-link#{if current == id, do: " active"}"

    case tab[:method] do
      :patch -> live_patch(tab[:name], to: path, class: class)
      :redirect -> live_redirect(tab[:name], to: path, class: class)
    end
  end

  defp render_content(socket, page, tabs, current) do
    case tabs[current][:render] do
      {component, component_assigns} ->
        live_component(socket, component, [page: page] ++ component_assigns)

      # Needed for the metrics page, should be removed soon
      fun when is_function(fun, 0) ->
        fun.()
    end
  end
end
