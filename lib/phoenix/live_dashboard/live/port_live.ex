defmodule Phoenix.LiveDashboard.PortInfoComponent do
  use Phoenix.LiveDashboard.Web, :live_component

  alias Phoenix.LiveDashboard.{SystemInfo, ProcessesLive}

  @max_list_length 100
  @info_keys [
    :name,
    :links,
    :id,
    :connected,
    :input,
    :output,
    :os_pid
  ]

  @impl true
  def render(assigns) do
    ~L"""
    <div class="process-info">
      <%= unless @alive do %>
        <div class="process-info-dead mt-1 mb-3">Process is dead.</div>
      <% end %>

      <table class="table table-hover process-info-table">
        <tbody>
          <tr><td class="border-top-0">Registered name</td><td class="border-top-0"><pre><%= @name %></pre></td></tr>
          <tr><td>Id</td><td><pre><%= @id %></pre></td></tr>
          <tr><td>Name</td><td><pre><%= @name %></pre></td></tr>
          <tr><td>Connected</td><td><pre><%= @connected %></pre></td></tr>
          <tr><td>Input</td><td><pre><%= @input %></pre></td></tr>
          <tr><td>Output</td><td><pre><%= @output %></pre></td></tr>
          <tr><td>OS pid</td><td><pre><%= @os_pid %></pre></td></tr>
          <tr><td>Links</td><td><pre><%= @links %></pre></td></tr>
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
  def update(%{port: port} = assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(port: port)
     |> assign_info()}
  end

  defp assign_info(%{assigns: assigns} = socket) do
    case SystemInfo.fetch_port_info(assigns.port, @info_keys) do
      {:ok, info} ->
        Enum.reduce(info, socket, fn {key, val}, acc ->
          assign(acc, key, inspect_info(key, val, assigns.port_link_builder))
        end)
        |> assign(alive: true)

      :error ->
        assign(socket, alive: false)
    end
  end

  defp inspect_info(key, val, link_builder)
       when key in [:links],
       do: inspect_list(val, link_builder)

  defp inspect_info(key, val, link_builder)
       when key in [:name, :id, :input, :output, :os_pid],
       do: inspect_val(val, link_builder)

  defp inspect_info(_key, val, link_builder), do: inspect_val(val, link_builder)

  defp inspect_val(pid, _link_builder) when is_pid(pid) do
    inspect(pid)
  end

  defp inspect_val(pid, link_builder) when is_pid(pid) do
    live_redirect(inspect(pid), to: link_builder.(pid))
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
