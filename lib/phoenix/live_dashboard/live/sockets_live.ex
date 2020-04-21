defmodule Phoenix.LiveDashboard.SocketsLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.TableHelpers

  alias Phoenix.LiveDashboard.SystemInfo

  @sort_by ~w(module recv_oct send_oct connected local_address foreign_address state type)

  @tttt """
    port
    The internal index of the port.

    module
    The callback module of the socket.

    recv
    Number of bytes received by the socket.

    sent
    Number of bytes sent from the socket.

    owner
    The socket owner process.

    local_address
    The local address of the socket.

    foreign_address
    The address and port of the other end of the connection.

    state
    The connection state.

    type
    STREAM or DGRAM or SEQPACKET.
  """

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    {:ok, assign_defaults(socket, params, session, true)}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply,
     socket
     |> assign_params(params, @sort_by)
     |> fetch_sockets()}
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
              <input type="search" name="search" class="form-control form-control-sm" value="<%= @params.search %>" placeholder="Search by name or module" phx-debounce="300">
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
            tables out of <%= @total %>
          </div>
        </div>
      </form>

      <div class="card tabular-card mb-4 mt-4">
        <div class="card-body p-0">
          <div class="dash-table-wrapper">
            <table class="table table-hover mt-0 dash-table clickable-rows">
              <thead>
                <tr>
                  <th class="pl-4">Port ID</th>
                  <th>
                  <%= sort_link(@socket, @live_action, @menu, @params, :module, "Module") %>
                  </th>
                  <th>
                    <%= sort_link(@socket, @live_action, @menu, @params, :send_oct, "Sent") %>
                  </th>
                  <th>
                    <%= sort_link(@socket, @live_action, @menu, @params, :recv_oct, "Received") %>
                  </th>
                  <th>Owner</th>
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
                </tr>
              </thead>
              <tbody>
                <%= for socket <- @sockets do %>
                  <tr phx-page-loading>
                    <td class="tabular-column-name pl-4"><%= socket[:id] %></td>
                    <td><%= socket[:module] %></td>
                    <td><%= format_bytes(socket[:send_oct]) %></td>
                    <td><%= format_bytes(socket[:recv_oct]) %></td>
                    <td><%= format_value(socket[:connected], &live_dashboard_path(@socket, &1, &2, &3, @params)) %></td>
                    <td><%= format_address(socket[:local_address]) %></td>
                    <td><%= format_address(socket[:foreign_address]) %></td>
                    <td><%= format_state(socket[:state]) %></td>
                    <td><%= socket[:type] %></td>
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

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, :sockets, node, [], params)
  end

  def pid_path(socket, pid) do
    node = node(decode_pid(pid))
    live_dashboard_path(socket, :processes, node, [pid])
  end

  defp return_path(socket, menu, params) do
    self_path(socket, menu.node, params)
  end

  defp format_address({:error, :enotconn}), do: "*:*"
  defp format_address({:error, _}), do: " "
  defp format_address({:ok, address}) do
    case address do
      {{0,0,0,0}, port} -> "*:#{port}"
      {{0,0,0,0,0,0,0,0}, port} -> "*:#{port}"
      {{127,0,0,1}, port} -> "localhost:#{port}"
      {{0,0,0,0,0,0,0,1}, port} -> "localhost:#{port}"
      {:local, path} -> "local:#{path}"
      {ip, port} -> "#{:inet.ntoa(ip)}:#{port}"
    end
  end

  defp format_state(flags) do
    case Enum.sort(flags) do
      [:accepting | _]                  -> "ACCEPTING"
      [:bound, :busy, :connected | _]   -> "CONNECTED(BB)"
      [:bound, :connected | _]          -> "CONNECTED(B)"
      [:bound, :listen, :listening | _] -> "LISTENING"
      [:bound, :listen | _]             -> "LISTEN"
      [:bound, :connecting | _]         -> "CONNECTING"
      [:bound, :open]                   -> "BOUND"
      [:connected, :open]               -> "CONNECTED(O)"
      [:open]                           -> "IDLE"
      []                                -> "CLOSED"
      sorted                            -> inspect(sorted)
    end
  end
end
