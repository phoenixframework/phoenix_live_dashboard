defmodule Phoenix.LiveDashboard.ProcessInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.SystemInfo

  @max_list_length 100
  @info_keys [
    :registered_name,
    :current_function,
    :initial_call,
    :status,
    :message_queue_len,
    :links,
    :monitors,
    :monitored_by,
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
          <tr><td>registered_name</td><td><pre><%= @registered_name %></pre></td></tr>
          <tr><td>current_function</td><td><pre><%= @current_function %></pre></td></tr>
          <tr><td>initial_call</td><td><pre><%= @initial_call %></pre></td></tr>
          <tr><td>status</td><td><pre><%= @status %></pre></td></tr>
          <tr><td>message_queue_len</td><td><pre><%= @message_queue_len %></pre></td></tr>
          <tr><td>links</td><td><%= @links %></td></tr>
          <tr><td>monitors</td><td><%= @monitors %></td></tr>
          <tr><td>monitored_by</td><td><%= @monitored_by %></td></tr>
          <tr><td>trap_exit</td><td><pre><%= @trap_exit %></pre></td></tr>
          <tr><td>error_handler</td><td><pre><%= @error_handler %></pre></td></tr>
          <tr><td>priority</td><td><pre><%= @priority %></pre></td></tr>
          <tr><td>group_leader</td><td><pre><%= @group_leader %></pre></td></tr>
          <tr><td>total_heap_size</td><td><pre><%= @total_heap_size %></pre></td></tr>
          <tr><td>heap_size</td><td><pre><%= @heap_size %></pre></td></tr>
          <tr><td>stack_size</td><td><pre><%= @stack_size %></pre></td></tr>
          <tr><td>reductions</td><td><pre><%= @reductions %></pre></td></tr>
          <tr><td>garbage_collection</td><td><pre><%= @garbage_collection %></pre></td></tr>
          <tr><td>suspending</td><td><pre><%= @suspending %></pre></td></tr>
          <tr><td>current_stacktrac</td><td><pre><%= @current_stacktrace %></pre></td></tr>
        </tbody>
      </table>
    </div>
    """
  end

  @impl true
  def mount(socket) do
    {:ok, socket}
  end

  @impl true
  def update(%{id: pid} = assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(pid: pid)
     |> assign_info()}
  end

  defp assign_info(%{assigns: assigns} = socket) do
    assigns.pid
    |> SystemInfo.fetch_process_info(@info_keys)
    |> Enum.reduce(socket, fn {key, val}, acc ->
      assign(acc, key, inspect_info(key, val, assigns.pid_link_builder))
    end)
  end

  defp inspect_info(key, val, link_builder)
       when key in [:links, :monitors, :monitored_by],
       do: inspect_list(val, link_builder)

  defp inspect_info(:current_function, val, _), do: SystemInfo.format_call(val)
  defp inspect_info(:initial_call, val, _), do: SystemInfo.format_call(val)
  defp inspect_info(:current_stacktrace, val, _), do: Exception.format_stacktrace(val)
  defp inspect_info(_key, val, link_builder), do: inspect_val(val, link_builder)

  defp inspect_val(pid, link_builder) when is_pid(pid) do
    live_redirect(inspect(pid), to: link_builder.(pid))
  end
  defp inspect_val(val, _link_builder), do: inspect(val, pretty: true, limit: 100)

  defp inspect_list(list, link_builder) do
    {entries, left_over} = Enum.split(list, @max_list_length)

    entries
    |> Enum.map(&inspect_val(&1, link_builder))
    |> Kernel.++(if left_over == [], do: [], else: "...")
    |> Enum.intersperse({:safe, "<br />"})
  end
end
