defmodule Phoenix.LiveDashboard.OsMonLive do
  use Phoenix.LiveDashboard.Web, :live_view
  alias Phoenix.LiveDashboard.{SystemInfo}

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    socket = assign_defaults(socket, params, session, true)

    %{
      cpu_count: cpu_count,
      cpu_nprocs: cpu_nprocs,
      cpu_per_core: cpu_per_core,
      cpu_total: cpu_total,
      cpu_usage: cpu_usage,
      disk: disk,
      mem: mem,
      system_mem: system_mem
    } = SystemInfo.fetch_os_mon_info(socket.assigns.menu.node)

    socket =
      assign(socket,
        cpu_count: cpu_count,
        cpu_nprocs: cpu_nprocs,
        cpu_per_core: cpu_per_core,
        cpu_total: cpu_total,
        cpu_usage: cpu_usage,
        disk: disk,
        mem: mem,
        system_mem: system_mem
      )

    {:ok, socket}
  end

  def mount(_params, _session, socket) do
    {:ok, push_redirect(socket, to: live_dashboard_path(socket, :home, node()))}
  end

  @impl true
  def render(assigns) do
    ~L"""
    Number of OS processes: <%= @cpu_nprocs %>
    <br>
    Number of cpus: <%= @cpu_count %>
    """
  end

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: live_dashboard_path(socket, :home, node))}
  end

  def handle_info(:refresh, socket) do
    socket
    |> assign(os_mon_info: SystemInfo.fetch_os_mon_info(socket.assigns.menu.node))

    {:noreply, socket}
  end
end
