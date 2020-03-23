defmodule Phoenix.LiveDashboard.ProcessInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.SystemInfo

  # links, monitors, montior by
  @info_keys [
    :current_function,
    :initial_call,
    :status,
    :message_queue_len,
    :links,
    :trap_exit,
    :error_handler,
    :priority,
    :group_leader,
    :total_heap_size,
    :heap_size,
    :stack_size,
    :reductions,
    :garbage_collection,
    :suspending,
    :current_stacktrace
  ]

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  @impl true
  def update(%{id: pid} = assigns, socket) do
    IO.inspect({:update, pid})
    {:ok,
     socket
     |> assign(assigns)
     |> assign(pid: pid, info: SystemInfo.fetch_process_info(pid, @info_keys))}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="col-md-12 charts-col">
      <table class="table table-hover mt-4">
        <thead>
          <tr>
            <th class="border-top-0" colspan="2"><%= inspect @pid %></th>
          </tr>
        </thead>
        <tbody>
          <%= for {key, val} <- @info do %>
            <tr>
              <td><%= key %></td>
              <td><pre><%= inspect_info(key, val) %></pre></td>
            </tr>
          <% end %>
        </tbody>
      </table>
    </div>
    """
  end

  defp inspect_info(:current_function, val), do: SystemInfo.format_call(val)
  defp inspect_info(:initial_call, val), do: SystemInfo.format_call(val)
  defp inspect_info(:current_stacktrace, val), do: Exception.format_stacktrace(val)
  defp inspect_info(_key, val), do: inspect(val, pretty: true, limit: 100)
end
