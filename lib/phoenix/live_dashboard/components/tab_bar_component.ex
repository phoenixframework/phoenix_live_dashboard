defmodule Phoenix.LiveDashboard.TabBarComponent do
  @moduledoc false
  use Phoenix.LiveDashboard.Web, :live_component

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  @impl true
  def update(assigns, socket) do
    %{page: page, entries: entries} = assigns
    current = current_tab(page.params, entries)
    {:ok, assign(socket, entries: entries, current: current, page: page)}
  end

  defp current_tab(%{"tab" => tab}, entries) do
    if Enum.any?(entries, fn {id, _} -> Atom.to_string(id) == tab end) do
      String.to_existing_atom(tab)
    else
      default_tab(entries)
    end
  end

  defp current_tab(_, entries) do
    default_tab(entries)
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
            <%= for {id, tab} <- @entries do %>
              <li class="nav-item">
                <%= live_redirect(Access.fetch!(tab, :name),
                      to: live_dashboard_path(@socket, @page, update_params(tab: id)),
                      class: "nav-link #{if @current == id, do: "active"}") %>
              </li>
            <% end %>
          </ul>
        </div>
      </div>
      <%= render_content(@socket, @page, @entries, @current) %>
    </div>
    """
  end

  defp render_content(socket, page, entries, current) do
    entries
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

  defp update_params(new_params) do
    fn all_params ->
      new_params = Enum.into(new_params, %{}, fn {k, v} -> {Atom.to_string(k), to_string(v)} end)
      Map.merge(all_params, new_params)
    end
  end
end
