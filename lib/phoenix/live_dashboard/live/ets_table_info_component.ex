defmodule Phoenix.LiveDashboard.EtsTableInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.SystemInfo

  @max_list_length 100
  @info_keys [
    :id,
    :name,
    :size,
    :node,
    :named_table,
    :read_concurrency,
    :write_concurrency,
    :compressed,
    :memory,
    :owner,
    :heir,
    :type,
    :keypos,
    :protection
  ]

  @impl true
  def render(assigns) do
    ~L"""
    <div class="process-info">
      <%= unless @alive do %>
        <div class="process-info-dead mt-1 mb-3">Process is dead.</div>
      <% end %>

      <table class="table ets-table-info-table">
        <tbody>
          <tr><td class="border-top-0">ID</td><td class="border-top-0"><pre><%= @id %></pre></td></tr>
          <tr><td class="border-top-0">Name</td><td class="border-top-0"><pre><%= @name %></pre></td></tr>
          <tr><td class="border-top-0">Size</td><td class="border-top-0"><pre><%= @size %></pre></td></tr>
          <tr><td class="border-top-0">Node</td><td class="border-top-0"><pre><%= @node %></pre></td></tr>
          <tr><td class="border-top-0">Named table</td><td class="border-top-0"><pre><%= @named_table %></pre></td></tr>
          <tr><td class="border-top-0">Read concurrency</td><td class="border-top-0"><pre><%= @read_concurrency %></pre></td></tr>
          <tr><td class="border-top-0">Write concurrency</td><td class="border-top-0"><pre><%= @write_concurrency %></pre></td></tr>
          <tr><td class="border-top-0">Compressed</td><td class="border-top-0"><pre><%= @compressed %></pre></td></tr>
          <tr><td class="border-top-0">Memory</td><td class="border-top-0"><pre><%= @memory %></pre></td></tr>
          <tr><td class="border-top-0">Owner</td><td class="border-top-0"><pre><%= @owner %></pre></td></tr>
          <tr><td class="border-top-0">Heir</td><td class="border-top-0"><pre><%= @heir %></pre></td></tr>
          <tr><td class="border-top-0">Type</td><td class="border-top-0"><pre><%= @type %></pre></td></tr>
          <tr><td class="border-top-0">Keypos</td><td class="border-top-0"><pre><%= @keypos %></pre></td></tr>
          <tr><td class="border-top-0">Protection</td><td class="border-top-0"><pre><%= @protection %></pre></td></tr>
        </tbody>
      </table>
    </div>
    """
  end

  @impl true
  def mount(socket) do
    {:ok, Enum.reduce(@info_keys, socket, &assign(&2, &1, nil))}
  end

  @impl true
  def update(%{id: ref} = assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(ref: ref)
     |> assign_info()}
  end

  defp assign_info(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_table_info(assigns.ref) do
      {:ok, info} ->
        Enum.reduce(info, socket, fn {key, val}, acc ->
          assign(acc, key, inspect_info(key, val, assigns.ref_link_builder))
        end)
        |> assign(alive: true)
      :error ->
        assign(socket, alive: false)
    end
  end

  defp inspect_info(key, val, link_builder)
       when key in [:links, :monitors, :monitored_by],
       do: inspect_list(val, link_builder)

  defp inspect_info(:current_function, val, _), do: SystemInfo.format_call(val)
  defp inspect_info(:initial_call, val, _), do: SystemInfo.format_call(val)
  defp inspect_info(:current_stacktrace, val, _), do: format_stack(val)
  defp inspect_info(_key, val, link_builder), do: inspect_val(val, link_builder)

  defp inspect_val(ref, link_builder) when is_reference(ref) do
    live_redirect(inspect(ref), to: link_builder.(ref))
  end

  defp inspect_val({:process, pid}, link_builder) when is_pid(pid) do
    inspect_val(pid, link_builder)
  end

  defp inspect_val(val, _link_builder), do: inspect(val, pretty: true, limit: 100)

  defp inspect_list(list, link_builder) do
    {entries, left_over} = Enum.split(list, @max_list_length)

    entries
    |> Enum.map(&inspect_val(&1, link_builder))
    |> Kernel.++(if left_over == [], do: [], else: ["..."])
    |> Enum.intersperse({:safe, "<br />"})
  end

  defp format_stack(stacktrace) do
    stacktrace
    |> Exception.format_stacktrace()
    |> String.split("\n")
    |> Enum.map(&String.replace_prefix(&1, "   ", ""))
    |> Enum.join("\n")
  end
end
