defmodule Phoenix.LiveDashboard.LiveHelpers do
  # General helpers for live views (not-rendering related).
  @moduledoc false

  alias Phoenix.LiveDashboard.TargetNode

  @doc """
  Computes a route path to the live dashboard.
  """
  def live_dashboard_path(socket, action, node, args \\ [], params \\ []) do
    apply(
      socket.router.__helpers__(),
      :live_dashboard_path,
      [socket, action, node | args] ++ [params]
    )
  end

  @doc """
  Assign default values on the socket.
  """
  def assign_defaults(socket, params, session, refresher? \\ false) do
    param_node = Map.fetch!(params, "node")
    found_node = Enum.find(nodes(), &(Atom.to_string(&1) == param_node))
    target_node = found_node || node()

    socket =
      Phoenix.LiveView.assign(socket, :menu, %{
        refresher?: refresher?,
        action: socket.assigns.live_action,
        node: target_node,
        metrics: session["metrics"],
        os_mon: TargetNode.os_mon(target_node),
        request_logger: session["request_logger"],
        dashboard_running?: TargetNode.dashboard_running?(target_node)
      })

    if found_node do
      TargetNode.ensure_loaded(found_node, Phoenix.LiveDashboard.SystemInfo)
      socket
    else
      Phoenix.LiveView.push_redirect(socket, to: live_dashboard_path(socket, :home, node()))
    end
  end

  @doc """
  All connected nodes (including the current node).
  """
  def nodes(), do: [node()] ++ Node.list(:connected)
end
