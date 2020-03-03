defmodule Phoenix.LiveDashboard.IndexLive do
  use Phoenix.LiveDashboard.Web, :live_view

  @impl true
  def mount(_params, _metrics, socket) do
    {:ok, socket}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <h1>Welcome to the LiveDashboard</h1>

    <ul>
      <li><%= live_redirect "Metrics", to: live_dashboard_path(@socket, :metrics) %></li>
    </ul>
    """
  end
end
