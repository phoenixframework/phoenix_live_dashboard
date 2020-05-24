defmodule Phoenix.LiveDashboard.SocketsLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.TableHelpers

  alias Phoenix.LiveDashboard.SystemInfo

  @sort_by ~w(send_oct recv_oct module connected local_address foreign_address state type)
  @temporary_assigns [sockets: [], total: 0]

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    {:ok, assign_mount(socket, :sockets, params, session, true),
     temporary_assigns: @temporary_assigns}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply,
     socket |> assign_params(params) |> assign_table_params(params, @sort_by) |> fetch_sockets()}
  end

  defp fetch_sockets(socket) do
    %{search: search, sort_by: sort_by, sort_dir: sort_dir, limit: limit} = socket.assigns.params

    {sockets, total} =
      SystemInfo.fetch_sockets(socket.assigns.menu.node, search, sort_by, sort_dir, limit)

    assign(socket, sockets: sockets, total: total)
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="tabular-page">
      <h5 class="card-title">Sockets</h5>

      <div class="tabular-search">
        <form phx-change="search" phx-submit="search" class="form-inline">
          <div class="form-row align-items-center">
            <div class="col-auto">
              <input type="search" name="search" class="form-control form-control-sm" value="<%= @params.search %>" placeholder="Search by local or foreign address" phx-debounce="300">
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
            sockets out of <%= @total %>
          </div>
        </div>
      </form>

      <div class="card tabular-card mb-4 mt-4">
        <div class="card-body p-0">
          <div class="dash-table-wrapper">
            <table class="table table-hover mt-0 dash-table clickable-rows">
              <thead>
                <tr>
                  <th class="pl-4">Port</th>
                  <th>
                  <%= sort_link(@socket, @live_action, @menu, @params, :module, "Module") %>
                  </th>
                  <th class="text-right pr-4">
                    <%= sort_link(@socket, @live_action, @menu, @params, :send_oct, "Sent") %>
                  </th>
                  <th class="text-right pr-4">
                    <%= sort_link(@socket, @live_action, @menu, @params, :recv_oct, "Received") %>
                  </th>
                  <th>
                    <%= sort_link(@socket, @live_action, @menu, @params, :local_address, "Local Address") %>
                  </th>
                  <th>
                    <%= sort_link(@socket, @live_action, @menu, @params, :foreign_address, "Foreign Address") %>
                  </th>
                  <th>
                    <%= sort_link(@socket, @live_action, @menu, @params, :state, "State") %>
                  </th>
                  <th>
                    <%= sort_link(@socket, @live_action, @menu, @params, :type, "Type") %>
                  </th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                <%= for socket <- @sockets, encoded_socket = encode_socket(socket[:port]) do %>
                  <tr phx-click="show_info" phx-value-socket="<%= encoded_socket %>" phx-page-loading>
                    <td class="tabular-column-name tabular-column-id pl-4"><%= String.replace(encoded_socket, "Socket", "") %></td>
                    <td><%= socket[:module] %></td>
                    <td class="tabular-column-bytes pr-4"><%= format_bytes(socket[:send_oct]) %></td>
                    <td class="tabular-column-bytes pr-4"><%= format_bytes(socket[:recv_oct]) %></td>
                    <td><%= socket[:local_address] %></td>
                    <td><%= socket[:foreign_address] %></td>
                    <td><%= socket[:state] %></td>
                    <td><%= socket[:type] %></td>
                    <td><%= encode_pid(socket[:connected]) %></td>
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
    {:noreply, fetch_sockets(socket)}
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

  def handle_event("show_info", %{"socket" => socket_info}, socket) do
    params = Map.put(socket.assigns.params, :info, socket_info)
    {:noreply, push_redirect(socket, to: self_path(socket, node(), params))}
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, :sockets, node, params)
  end
end
