defmodule Phoenix.LiveDashboard.ProcessInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.SystemInfo

  @info_keys [
    :initial_call,
    :registered_name,
    :current_function,
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
  def mount(socket) do
    {:ok, Enum.reduce(@info_keys, socket, &assign(&2, &1, nil))}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="tabular-info">
      <%= if @alive do %>
        <Phoenix.LiveDashboard.PageBuilder.label_value_list>
          <:elem label="Registered name"><%= @registered_name %></:elem>
          <:elem label="Current function"><%= @current_function %></:elem>
          <:elem label="Initial call"><%= @initial_call %></:elem>
          <:elem label="Status"><%= @status %></:elem>
          <:elem label="Message queue length"><%= @message_queue_len %></:elem>
          <:elem label="Ancestors"><.info links={@ancestor_links} /></:elem>
          <:elem label="Other links"><.info links={@other_links} /></:elem>
          <:elem label="Monitors"><.info links={@monitors} /></:elem>
          <:elem label="Monitored by"><.info links={@monitored_by} /></:elem>
          <:elem label="Trap exit"><%= @trap_exit %></:elem>
          <:elem label="Error handler"><%= @error_handler %></:elem>
          <:elem label="Priority"><%= @priority %></:elem>
          <:elem label="Group leader"><%= @group_leader %></:elem>
          <:elem label="Total heap size"><%= @total_heap_size %></:elem>
          <:elem label="Heap size"><%= @heap_size %></:elem>
          <:elem label="Stack size"><%= @stack_size %></:elem>
          <:elem label="Reductions"><%= @reductions %></:elem>
          <:elem label="Garbage collection"><%= @garbage_collection %></:elem>
          <:elem label="Suspending"><%= @suspending %></:elem>
          <:elem label="Current stacktrace"><%= @current_stacktrace %></:elem>
        </Phoenix.LiveDashboard.PageBuilder.label_value_list>

        <%= if @page.allow_destructive_actions do %>
          <div class="modal-footer">
            <button class="btn btn-danger" phx-target={@myself} phx-click="kill">Kill process</button>
          </div>
        <% end %>
      <% else %>
        <div class="tabular-info-not-exists mt-1 mb-3">Process is not alive or does not exist.</div>
      <% end %>
    </div>
    """
  end

  @impl true
  def update(%{id: "PID" <> pid, path: path, return_to: return_to, page: page}, socket) do
    pid = :erlang.list_to_pid(String.to_charlist(pid))

    {:ok,
     socket |> assign(pid: pid, path: path, page: page, return_to: return_to) |> assign_info()}
  end

  @impl true
  def handle_event("kill", _, socket) do
    true = socket.assigns.page.allow_destructive_actions
    Process.exit(socket.assigns.pid, :kill)
    {:noreply, push_patch(socket, to: socket.assigns.return_to)}
  end

  defp assign_info(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_process_info(assigns.pid) do
      {:ok, info} ->
        Enum.reduce(info, socket, fn
          {:ancestors, ancestors}, acc ->
            acc
            |> assign(:ancestor_links, format_info(:links, ancestors, assigns.path))
            |> assign(
              :other_links,
              format_info(:links, info[:links] -- ancestors, assigns.path)
            )

          {key, val}, acc ->
            assign(acc, key, format_info(key, val, assigns.path))
        end)
        |> assign(alive: true)

      :error ->
        assign(socket, alive: false)
    end
  end

  defp format_info(key, val, live_dashboard_path)
       when key in [:links, :monitors, :monitored_by],
       do: format_value(val, live_dashboard_path)

  defp format_info(:current_function, val, _), do: format_call(val)
  defp format_info(:initial_call, val, _), do: format_initial_call(val)
  defp format_info(:current_stacktrace, val, _), do: format_stacktrace(val)
  defp format_info(_key, val, live_dashboard_path), do: format_value(val, live_dashboard_path)

  defp info(%{links: links} = assigns) when is_list(links) do
    ~H"""
    <%= for info <- @links do %>
      <%= info %>
    <% end %>
    """
  end

  defp info(%{links: _links} = assigns), do: ~H|<%= @links %>|
end
