defmodule Phoenix.LiveDashboard.IndexLive do
  use Phoenix.LiveDashboard.Web, :live_view

  @impl true
  def mount(_params, session, socket) do
    {:ok, assign(socket, metrics: session["metrics"], request_logger: session["request_logger"])}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <h1>Welcome to the LiveDashboard</h1>

    <ul>
      <li>
        <%= if @metrics do %>
          <%= live_redirect "Metrics", to: live_dashboard_path(@socket, :metrics, [node()]) %>
        <% else %>
          Metrics (not configured - <%= link "learn more", to: guide(:metrics) %>)
        <% end %>
      </li>

      <li>
        <%= if @request_logger do %>
          <%= live_redirect "New request logger stream", to: live_dashboard_path(@socket, :request_logger) %>
        <% else %>
          Request Logger (not configured - <%= link "learn more", to: guide(:request_logger) %>)
        <% end %>
      </li>
    </ul>
    """
  end

  defp guide(name), do: "https://hexdocs.pm/phoenix_live_dashboard/#{name}.html"
end
