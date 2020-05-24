defmodule Phoenix.LiveDashboard.PortsLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.TableHelpers

  alias Phoenix.LiveDashboard.SystemInfo

  @sort_by ~w(output input)
  @temporary_assigns [ports: [], total: 0]

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    {:ok, assign_mount(socket, :ports, params, session, true),
     temporary_assigns: @temporary_assigns}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply,
     socket |> assign_params(params) |> assign_table_params(params, @sort_by) |> fetch_ports()}
  end

  defp fetch_ports(socket) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = socket.assigns.params

    {ports, count} =
      SystemInfo.fetch_ports(socket.assigns.menu.node, search, sort_by, sort_dir, limit)

    assign(socket, ports: ports, total: count)
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="tabular-page">
      <h5 class="card-title">Ports</h5>

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
            ports out of <%= @total %>
          </div>
        </div>
      </form>

      <div class="card table-card mb-4 mt-4">
        <div class="card-body p-0">
          <div class="dash-table-wrapper">
            <table class="table table-hover mt-0 dash-table clickable-rows">
              <thead>
                <tr>
                  <th class="pl-4">Port</th>
                  <th>Name or path</th>
                  <th>OS pid</td>
                  <th class="text-right">
                    <%= sort_link(@socket, @live_action, @menu, @params, :input, "Input") %>
                  </th>
                  <th class="text-right pr-4">
                    <%= sort_link(@socket, @live_action, @menu, @params, :output, "Output") %>
                  </th>
                  <th class="text-right">Id</th>
                  <th>Owner</td>
                </tr>
              </thead>
              <tbody>
                <%= for port <- @ports, encoded_port = encode_port(port[:port]) do %>
                  <tr phx-click="show_info" phx-value-port="<%= encoded_port %>" phx-page-loading>
                    <td class="tabular-column-id pl-4"><%= String.replace(encoded_port, "Port", "") %></td>
                    <td class="w-50"><%= format_path(port[:name]) %></td>
                    <td><%= if port[:os_pid] != :undefined, do: port[:os_pid] %></td>
                    <td class="tabular-column-bytes"><%= format_bytes(port[:input]) %></td>
                    <td class="tabular-column-bytes pr-4"><%= format_bytes(port[:output]) %></td>
                    <td class="text-right"><%= port[:id] %></td>
                    <td><%= inspect(port[:connected]) %></td>
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
    {:noreply, fetch_ports(socket)}
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

  def handle_event("show_info", %{"port" => port}, socket) do
    params = Map.put(socket.assigns.params, :info, port)
    {:noreply, push_redirect(socket, to: self_path(socket, node(), params))}
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, :ports, node, params)
  end
end
