defmodule Phoenix.LiveDashboard.IndexLive do
  use Phoenix.LiveDashboard.Web, :live_view

  @impl true
  def mount(%{"node" => _} = params, session, socket) do
    socket =
      socket
      |> assign_defaults(params, session)
      |> assign(metrics: session["metrics"], request_logger: session["request_logger"])

    {:ok, socket}
  end

  def mount(_params, _session, socket) do
    {:ok, push_redirect(socket, to: live_dashboard_path(socket, :index, node()))}
  end

  @impl true
  def handle_info({:node_redirect, node}, socket) do
    {:noreply, push_redirect(socket, to: live_dashboard_path(socket, :index, node))}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="row">
      <div class="col-sm-6">
        <div class="box-cell">
          <h1>Welcome to the LiveDashboard :d</h1>

          <ul>
            <li>
              <%= if @metrics do %>
                <%= live_redirect "Metrics", to: live_dashboard_path(@socket, :metrics, @node) %>
              <% else %>
                Metrics (not configured - <%= link "learn more", to: guide(:metrics) %>)
              <% end %>
            </li>

            <li>
              <%= if @request_logger do %>
                <%= live_redirect "New request logger stream", to: live_dashboard_path(@socket, :request_logger, @node) %>
              <% else %>
                Request Logger (not configured - <%= link "learn more", to: guide(:request_logger) %>)
              <% end %>
            </li>
          </ul>
        </div>
      </div>
    </div>
    """
  end

  defp guide(name), do: "https://hexdocs.pm/phoenix_live_dashboard/#{name}.html"
end
