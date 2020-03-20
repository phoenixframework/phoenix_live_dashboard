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
    <div>
      <h5 class="card-title">Processes</h5>

      <div class="card mb-4">
        <div class="card-body">
          <form phx-change="select_limit" class="form-inline">
            <div class="input-group input-group-sm">
              Showing at most <select name="limit" class="custom-select" id="limit-select">
                <%= options_for_select(limit_options(), @params.limit) %>
              </select> processes out of <%= @total %>:
            </div>
          </form>
        
          <table class="table table-hover mt-4">
            <thead>
              <tr>
                <th class="border-top-0">PID</th>
                <th class="border-top-0">Name or initial call</th>
                <th class="border-top-0">
                  Memory

                  (
                    <%= sort_link(@socket, @params, :memory, :asc) %> |
                    <%= sort_link(@socket, @params, :memory, :desc) %>
                  )
                </th>
                <th class="border-top-0">
                  Reductions

                  (
                    <%= sort_link(@socket, @params, :reductions, :asc) %> |
                    <%= sort_link(@socket, @params, :reductions, :desc) %>
                  )
                </th>
                <th class="border-top-0">
                  MsgQ

                  (
                    <%= sort_link(@socket, @params, :message_queue_len, :asc) %> |
                    <%= sort_link(@socket, @params, :message_queue_len, :desc) %>
                  )
                </th>
                <th class="border-top-0">Current function</td>
              </tr>
            </thead>
            <tbody>
              <%= for process <- @processes do %>
                <tr>
                  <td><%= :erlang.pid_to_list(process[:pid]) %></td>
                  <td><%= format_name_or_initial_call(process[:name_or_initial_call]) %></td>
                  <td><%= process[:memory] %></td>
                  <td><%= process[:reductions] %></td>
                  <td><%= process[:message_queue_len] %></td>
                  <td><%= format_name_or_initial_call(process[:current_function]) %></td>
                </tr>
              <% end %>
            </tbody>
          </table>
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
