defmodule Phoenix.LiveDashboard.PortsLive do
  use Phoenix.LiveDashboard.Web, :live_view
  import Phoenix.LiveDashboard.TableHelpers

  alias Phoenix.LiveDashboard.{SystemInfo, ProcessInfoComponent}

  @sort_by ~w(id input output)

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    {:ok, assign_defaults(socket, params, session, true)}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply,
     socket
     |> assign_params(params, @sort_by)
     |> assign_pid(params)
     |> fetch_ports()}
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
    <div class="processes-page">
      <h5 class="card-title">Ports</h5>

      <div class="processes-search">
        <form phx-change="search" phx-submit="search" class="form-inline">
          <div class="form-row align-items-center">
            <div class="col-auto">
              <input type="search" name="search" class="form-control form-control-sm" value="<%= @params.search %>" placeholder="Search by port, name or PID" phx-debounce="300">
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

      <%= if @pid do %>
        <%= live_modal @socket, ProcessInfoComponent,
          id: @pid,
          title: inspect(@pid),
          return_to: return_path(@socket, @menu, @params),
          pid_link_builder: &port_info_path(@socket, &1, @params) %>
      <% end %>

      <div class="card processes-card mb-4 mt-4">
        <div class="card-body p-0">
          <div class="dash-table-wrapper">
            <table class="table table-hover mt-0 dash-table clickable-rows">
              <thead>
                <tr>
                  <th class="pl-4">Port</th>
                  <th>Name or initial call</th>
                  <th>OS pid</td>
                  <th class="text-right">
                    <%= sort_link(@socket, @live_action, @menu, @params, :id, "id") %>
                  </th>
                  <th class="text-right">
                    <%= sort_link(@socket, @live_action, @menu, @params, :input, "input") %>
                  </th>
                  <th class="text-right">
                    <%= sort_link(@socket, @live_action, @menu, @params, :output, "output") %>
                  </th>
                  <th>PID</td>
                </tr>
              </thead>
              <tbody>
                <%= for port <- @ports, list_pid = encode_pid(port[:connected]) do %>
                  <tr phx-click="show_info" phx-value-pid="<%= list_pid %>" phx-page-loading class="<%= row_class(port, @pid) %>">
                    <td class="processes-column-pid pl-4"><%= port[:port_str] %></td>
                    <td class="processes-column-name"><%= port[:name] %></td>
                    <td class="processes-column-current">
                      <%= unless port[:os_pid] == :undefined do %>
                        <%= port[:os_pid] %>
                      <% end %>
                    </td>
                    <td class="text-right"><%= port[:id] %></td>
                    <td class="text-right"><%= port[:input] %></td>
                    <td class="text-right"><%= port[:output] %></td>
                    <td class="processes-column-links"><%= list_pid %></td>
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
    if pid = socket.assigns.pid, do: send_update(PortInfoComponent, id: pid)
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

  @impl true
  def handle_event("show_info", %{"pid" => list_pid}, socket) do
    pid = decode_pid(list_pid)
    {:noreply, push_patch(socket, to: port_info_path(socket, pid, socket.assigns.params))}
  end

  defp port_info_path(socket, pid, params) when is_pid(pid) do
    live_dashboard_path(socket, :ports, node(pid), [encode_pid(pid)], params)
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, :ports, node, [], params)
  end

  defp assign_pid(socket, %{"pid" => pid_param}) do
    assign(socket, pid: decode_pid(pid_param))
  end

  defp assign_pid(socket, %{}), do: assign(socket, pid: nil)

  defp return_path(socket, menu, params) do
    self_path(socket, menu.node, params)
  end

  defp row_class(port_info, active_pid) do
    if port_info[:pid] == active_pid, do: "active", else: ""
  end

  @doc false
  def encode_pid(pid) do
    pid
    |> :erlang.pid_to_list()
    |> tl()
    |> Enum.drop(-1)
    |> List.to_string()
  end

  @doc false
  def decode_pid(list_pid), do: :erlang.list_to_pid([?<] ++ String.to_charlist(list_pid) ++ [?>])
  defp sort_dir_multipler(:asc), do: 1
  defp sort_dir_multipler(:desc), do: -1
end
