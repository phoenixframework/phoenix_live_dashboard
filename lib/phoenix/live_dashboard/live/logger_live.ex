defmodule Phoenix.LiveDashboard.LoggerLive do
  use Phoenix.LiveDashboard.Web, :live_view

  @impl true
  def mount(%{"stream" => stream} = params, session, socket) do
    %{"request_logger" => {param_key, cookie_key}} = session

    if connected?(socket) do
      # TODO: Remove || once we support Phoenix v1.5+
      endpoint = socket.endpoint
      pubsub_server = endpoint.config(:pubsub_server) || endpoint.__pubsub_server__()
      Phoenix.PubSub.subscribe(pubsub_server, Phoenix.LiveDashboard.RequestLogger.topic(stream))
    end

    socket =
      socket
      |> assign_defaults(params, session)
      |> assign(stream: stream, param_key: param_key, cookie_key: cookie_key)

    {:ok, socket, temporary_assigns: [messages: []]}
  end

  def mount(%{"node" => node}, %{"request_logger" => _}, socket) do
    stream = :crypto.strong_rand_bytes(3) |> Base.url_encode64()
    {:ok, push_redirect(socket, to: live_dashboard_path(socket, :request_logger, node, [stream]))}
  end

  @impl true
  def handle_info({:logger, _level, message}, socket) do
    {:noreply, assign(socket, messages: [message])}
  end

  def handle_info({:node_redirect, node}, socket) do
    to = live_dashboard_path(socket, :request_logger, node, [socket.assigns.stream])
    {:noreply, push_redirect(socket, to: to)}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <%= if @param_key do %>
      <p>Access any page with this query parameter:<br />
      <code>?<%= @param_key %>=<%= sign(@socket, @param_key, @stream) %></code></p>
    <% end %>

    <%= if @cookie_key do %>
      <p>Click this upcoming magic button to set or unset cookie:<br />
      <code><%= @cookie_key %>=<%= sign(@socket, @cookie_key, @stream) %></code></p>
    <% end %>

    <p><%= live_redirect "New stream", to: live_dashboard_path(@socket, :request_logger, @menu.node) %></p>

    <div id="logger-messages" phx-update="append">
      <%= for message <- @messages do %>
        <pre id="log-<%= System.unique_integer() %>"><%= message %></pre>
      <% end %>
    </div>
    """
  end

  defp sign(socket, key, value) do
    Phoenix.LiveDashboard.RequestLogger.sign(socket.endpoint, key, value)
  end
end
