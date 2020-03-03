defmodule Phoenix.LiveDashboard.LoggerLive do
  use Phoenix.LiveDashboard.Web, :live_view

  @impl true
  def mount(%{"stream" => stream}, %{"request_logger" => param_key}, socket) do
    endpoint = socket.endpoint
    signed_param = Phoenix.LiveDashboard.RequestLogger.sign(endpoint, param_key, stream)

    if connected?(socket) do
      # TODO: Remove || once we support Phoenix v1.5+
      pubsub_server = endpoint.config(:pubsub_server) || endpoint.__pubsub_server__()
      Phoenix.PubSub.subscribe(pubsub_server, Phoenix.LiveDashboard.RequestLogger.topic(stream))
    end

    {:ok, assign(socket, signed_param: signed_param, param_key: param_key),
     temporary_assigns: [messages: []]}
  end

  def mount(%{}, %{"request_logger" => _}, socket) do
    stream = :crypto.strong_rand_bytes(3) |> Base.url_encode64()
    {:ok, push_redirect(socket, to: live_dashboard_path(socket, :request_logger, [stream]))}
  end

  @impl true
  def handle_info({:logger, _level, message}, socket) do
    {:noreply, assign(socket, messages: [message])}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <p>Access any page with this query parameter:<br /><code>?<%= @param_key %>=<%= @signed_param %></code></p>

    <p><%= live_redirect "New stream", to: live_dashboard_path(@socket, :request_logger) %></p>

    <div id="logger-messages" phx-update="append">
      <%= for message <- @messages do %>
        <pre id="log-<%= System.unique_integer() %>"><%= message %></pre>
      <% end %>
    </div>
    """
  end
end
