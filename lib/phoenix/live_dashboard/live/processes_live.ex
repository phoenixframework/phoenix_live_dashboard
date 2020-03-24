defmodule Phoenix.LiveDashboard.ProcessesLive do
  use Phoenix.LiveDashboard.Web, :live_view

  alias Phoenix.LiveDashboard.SystemInfo
  import Phoenix.LiveDashboard.TableHelpers

  @sort_by ~w(memory reductions message_queue_len)

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    {:ok, assign_defaults(socket, params, session, true)}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, socket |> assign_params(params, @sort_by) |> fetch_processes()}
  end

  defp fetch_processes(socket) do
    %{sort_by: sort_by, sort_dir: sort_dir, limit: limit} = socket.assigns.params

    {processes, total} =
      SystemInfo.fetch_processes(socket.assigns.menu.node, sort_by, sort_dir, limit)

    assign(socket, processes: processes, total: total)
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="processes-page">
      <h5 class="card-title">Processes</h5>

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
            processes out of <%= @total %>
          </div>
        </div>
      </form>

      <div class="card processes-card mb-4 mt-4">
        <div class="card-body p-0">
          <div class="processes-table-wrapper">
            <table class="table table-hover mt-0 processes-table">
              <thead>
                <tr>
                  <th class="pl-4">PID</th>
                  <th>Name or initial call</th>
                  <th class="text-right">
                    <%= sort_link(@socket, @params, :memory, "Memory") %>
                  </th>
                  <th class="text-right">
                    <%= sort_link(@socket, @params, :reductions, "Reductions") %>
                  </th>
                  <th class="text-right">
                    <%= sort_link(@socket, @params, :message_queue_len, "MsgQ") %>
                  </th>
                  <th>Current function</td>
                </tr>
              </thead>
              <tbody>
                <%= for process <- @processes do %>
                  <tr>
                    <td class="processes-column-pid pl-4"><%= :erlang.pid_to_list(process[:pid]) %></td>
                    <td class="processes-column-name"><%= format_name_or_initial_call(process[:name_or_initial_call]) %></td>
                    <td class="text-right"><%= process[:memory] %></td>
                    <td class="text-right"><%= process[:reductions] %></td>
                    <td class="text-right"><%= process[:message_queue_len] %></td>
                    <td class="processes-column-current"><%= format_name_or_initial_call(process[:current_function]) %></td>
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

  defp format_name_or_initial_call(name) when is_atom(name), do: inspect(name)
  defp format_name_or_initial_call({m, f, a}), do: Exception.format_mfa(m, f, a)

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: self_path(socket, node, socket.assigns.params))}
  end

  def handle_info(:refresh, socket) do
    {:noreply, fetch_processes(socket)}
  end

  @impl true
  def handle_event("select_limit", %{"limit" => limit}, socket) do
    params = %{socket.assigns.params | limit: limit}
    {:noreply, push_patch(socket, to: self_path(socket, socket.assigns.menu.node, params))}
  end

  defp self_path(socket, node, params) do
    live_dashboard_path(socket, :processes, node, [], params)
  end
end
