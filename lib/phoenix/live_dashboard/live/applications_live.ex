defmodule Phoenix.LiveDashboard.ApplicationsLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.TableHelpers

  alias Phoenix.LiveDashboard.SystemInfo

  @sort_by ~w(name version)

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    {:ok, 
    socket
    |> assign_defaults(params, session, true)}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, 
        socket
        |> assign_params(params, @sort_by)
        |> fetch_applications()}
  end

  defp fetch_applications(%{assigns: %{params: params, menu: menu}} = socket) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = params

    {applications, count} =
      SystemInfo.fetch_applications(menu.node, search, sort_by, sort_dir, limit)

    assign(socket, applications: applications, count: count)
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="tabular-page">
      <h5 class="card-title">Loaded Applications</h5>
      <div class="tabular-search">
        <form phx-change="search" phx-submit="search" class="form-inline">
          <div class="form-row align-items-center">
            <div class="col-auto">
              <input type="search" name="search" class="form-control form-control-sm" value="<%= @params.search %>" placeholder="Search by name or port" phx-debounce="300">
            </div>
          </div>
        </form>
      </div>

      <form phx-change="select_limit" class="form-inline">
        <div class="form-row align-items-center">
          <div class="col-auto">Showing at most</div>
          <div class="col-auto">
            <div class="input-group input-group-sm">
              <select name="limit" class="custom-select" id="limit-select">
                <%= options_for_select(limit_options(), @params.limit) %>
              </select>
            </div>
          </div>
          <div class="col-auto">
            applications out of <%= @count %>
          </div>
        </div>
      </form>
      <div class="card table-card mb-4">
        <div class="card-body p-0">
          <div class="dash-table-wrapper">
            <table class="table table-hover mt-0 dash-table clickable-rows">
              <thead>
                <tr>
                  <th class="pl-4">
                    <%= sort_link(@socket, @live_action, @menu, @params, :name, "Name") %>
                  </th>
                  <th>Description</th>
                  <th>Started</th>
                  <th>
                    <%= sort_link(@socket, @live_action, @menu, @params, :version, "Version") %>
                  </th>
                </tr>
              </thead>
              <tbody>
                <%= for {name, desc, ver, is_started?} <- @applications do %>
                  <tr class="<%= unless is_started?, do: "text-muted" %>">
                    <td><%= name %></td>
                    <td><%= desc %></td>
                  <td><%= if is_started?, do: "Yes", else: "No" %></td>
                    <td><%= ver %></td>
                  </tr>
                <% end %>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    """
  end
  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: self_path(socket, node, socket.assigns.params))}
  end
  def handle_info(:refresh, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_event("search", %{"search" => search}, socket) do
    %{menu: menu, params: params} = socket.assigns
    {:noreply, push_patch(socket, to: self_path(socket, menu.node, %{params | search: search}))}
  end

  def handle_event("select_limit", %{"limit" => limit}, socket) do
    %{menu: menu, params: params} = socket.assigns
    {:noreply, push_patch(socket, to: self_path(socket, menu.node, %{params | limit: limit}))}
  end


  defp self_path(socket, node, params) do
    live_dashboard_path(socket, :applications, node, [], params)
  end

end
