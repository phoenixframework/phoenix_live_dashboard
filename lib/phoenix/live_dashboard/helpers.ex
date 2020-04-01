defmodule Phoenix.LiveDashboard.Helpers do
  import Phoenix.HTML

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
    found_node = Enum.find([node() | Node.list()], &(Atom.to_string(&1) == param_node))

    socket =
      Phoenix.LiveView.assign(socket, :menu, %{
        refresher?: refresher?,
        action: socket.assigns.live_action,
        node: found_node || node(),
        metrics: session["metrics"],
        request_logger: session["request_logger"]
      })

    if found_node do
      socket
    else
      Phoenix.LiveView.push_redirect(socket, to: live_dashboard_path(socket, :home, node()))
    end
  end

  @doc """
  Shows a hint on the markup.
  """
  def hint(do: block) do
    ~E"""
    <div class="hint">
      <svg class="hint-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" fill="none"/>
        <rect x="19" y="10" width="6" height="5.76" rx="1" class="hint-icon-fill"/>
        <rect x="19" y="20" width="6" height="14" rx="1" class="hint-icon-fill"/>
        <circle cx="22" cy="22" r="20" class="hint-icon-stroke" stroke-width="4"/>
      </svg>
      <div class="hint-text"><%= block %></div>
    </div>
    """
  end
end
