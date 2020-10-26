defmodule Phoenix.LiveDashboard.RequestLoggerPage do
  @moduledoc false
  use Phoenix.LiveDashboard.PageBuilder, refresher?: false

  @menu_text "Request Logger"

  @impl true
  def mount(%{"stream" => stream}, session, socket) do
    %{
      "request_logger" => {param_key, cookie_key},
      "cookie_domain" => cookie_domain
    } = session

    if connected?(socket) do
      # TODO: Remove || once we support Phoenix v1.5+
      endpoint = socket.endpoint
      pubsub_server = endpoint.config(:pubsub_server) || endpoint.__pubsub_server__()
      Phoenix.PubSub.subscribe(pubsub_server, Phoenix.LiveDashboard.RequestLogger.topic(stream))
    end

    socket =
      assign(socket,
        stream: stream,
        param_key: param_key,
        cookie_key: cookie_key,
        cookie_domain: read_cookie_domain(socket, cookie_domain),
        cookie_enabled: false,
        autoscroll_enabled: true,
        messages_present: false
      )

    {:ok, socket, temporary_assigns: [messages: []]}
  end

  def mount(_, %{"request_logger" => _}, socket) do
    stream = :crypto.strong_rand_bytes(3) |> Base.url_encode64()
    to = live_dashboard_path(socket, socket.assigns.page, stream: stream)
    {:ok, push_redirect(socket, to: to)}
  end

  @impl true
  def menu_link(_, %{dashboard_running?: false}) do
    :skip
  end

  def menu_link(%{"request_logger" => nil}, _) do
    {:disabled, @menu_text, "https://hexdocs.pm/phoenix_live_dashboard/request_logger.html"}
  end

  def menu_link(_, _) do
    {:ok, @menu_text}
  end

  @impl true
  def handle_info({:logger, level, message}, socket) do
    {:noreply, assign(socket, messages: [{message, level}], messages_present: true)}
  end

  @impl true
  def handle_event("toggle_cookie", %{"enable" => "true"}, socket) do
    {:noreply, assign(socket, :cookie_enabled, true)}
  end

  def handle_event("toggle_cookie", _params, socket) do
    {:noreply, assign(socket, :cookie_enabled, false)}
  end

  def handle_event("toggle_autoscroll", _params, socket) do
    {:noreply, assign(socket, :autoscroll_enabled, !socket.assigns.autoscroll_enabled)}
  end

  @impl true
  def render_page(_assigns), do: raise("this page is special cased to use render/2 instead")

  def render(assigns) do
    ~L"""
    <!-- Card containing log messages -->
    <div class="logs-card" data-messages-present="<%= @messages_present %>">
      <h5 class="card-title">Logs</h5>

      <div class="card mb-4" id="logger-messages-card" phx-hook="PhxRequestLoggerMessages">
        <div class="card-body">
          <div id="logger-messages" phx-update="append">
            <%= for {message, level} <- @messages do %>
              <pre id="log-<%= System.unique_integer() %>" class="log-level-<%= level %>"><%= message %></pre>
            <% end %>
          </div>

          <%= autoscroll_checkbox(@autoscroll_enabled) %>
        </div>
      </div>
    </div>

    <!-- Row containing cookie and query parameter cards -->
    <div class="row">

      <!-- Param column -->
      <%= if @param_key do %>
        <div class="col-md d-flex flex-column" id="logger-query-params" phx-hook="PhxRequestLoggerQueryParameter">
          <h5 class="card-title flex-grow-0">Query Parameter</h5>

          <div class="card mb-4 flex-grow-1">
            <div class="card-body d-flex flex-column">
              <p>Access any page with this query parameter:</p>

              <textarea rows="1" class="code-field text-monospace" readonly="readonly">?<%= @param_key %>=<%= sign(@socket, @param_key, @stream) %></textarea>

              <div class="row flex-grow-0">
                <div class="col flex-grow-0">
                  <span class="copy-indicator">Copied!</span>
                </div>
                <div class="col">
                  <button class="btn btn-primary float-right">Copy to clipboard</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      <% end %>
      <!-- End param column -->

      <!-- Cookie column -->
      <%= if @cookie_key do %>
        <div class="col-md d-flex flex-column">
          <h5 class="card-title flex-grow-0">Cookie Parameter</h5>

          <div class="card mb-4 flex-grow-1">
            <div class="card-body d-flex flex-column">
              <p class="flex-grow-1">Create a logger cookie to automatically log requests for the current browser session.</p>

              <div class="row flex-grow-0">
                <div class="col">
                  <span class="cookie-status" data-enabled="<%= @cookie_enabled %>">Cookie enabled</span>
                </div>

                <div class="col">
                  <!-- Button and hook for switching cookie on and off -->
                  <div phx-hook="PhxRequestLoggerCookie" id="logger-cookie-buttons"
                    data-cookie-key=<%=@cookie_key %>
                    data-cookie-value=<%=sign(@socket, @cookie_key, @stream) %>
                    <%= if @cookie_domain do %>data-cookie-domain="<%=@cookie_domain %>"<% end %>
                    data-cookie-enabled="<%= @cookie_enabled %>">

                    <%= if @cookie_enabled do %>
                      <button phx-click="toggle_cookie" phx-value-enable="false" class="btn btn-secondary float-right">Disable cookie</button>
                    <% else %>
                      <button phx-click="toggle_cookie" phx-value-enable="true" class="btn btn-primary float-right">Enable cookie</button>
                    <% end %>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      <% end %>
      <!-- End cookie column -->
    </div>

    <!-- Row with a 'new stream' link -->
    <div class="row mb-3">
      <div class="col text-center">
        Want to refresh the logger parameter?
        <%= live_redirect "Start a new stream", to: live_dashboard_path(@socket, @page, []) %>
      </div>
    </div>
    """
  end

  defp sign(socket, key, value) do
    Phoenix.LiveDashboard.RequestLogger.sign(socket.endpoint, key, value)
  end

  defp autoscroll_checkbox(autoscroll_enabled) do
    checked_param = if autoscroll_enabled, do: "checked='checked'", else: ""
    assigns = %{checked_param: checked_param}

    ~L"""
    <!-- Autoscroll ON/OFF checkbox -->
    <div id="logger-autoscroll" class="text-right mt-3">
      <label>Autoscroll <input phx-click="toggle_autoscroll" <%= @checked_param %> class="logger-autoscroll-checkbox" type="checkbox"></label>
    </div>
    """
  end

  defp read_cookie_domain(socket, :parent) do
    socket.host_uri.host |> String.split(".", parts: 2) |> List.last()
  end

  defp read_cookie_domain(_socket, domain), do: domain
end
