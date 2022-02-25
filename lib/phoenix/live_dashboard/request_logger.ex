defmodule Phoenix.LiveDashboard.RequestLogger do
  @moduledoc """
  A plug that enables request logging.

  See [our Request Logger guides](request_logger.html) for more information.
  """

  @behaviour Plug
  @max_age 3600
  @private_key :phoenix_request_logger

  @impl true
  def init(opts) do
    param_key = opts[:param_key]
    cookie_key = opts[:cookie_key]

    unless param_key || cookie_key do
      raise ArgumentError, "either :param_key or :cookie_key is expected"
    end

    {param_key, cookie_key}
  end

  @impl true
  def call(conn, {param_key, cookie_key}) do
    conn
    |> verify_from_param_key(param_key)
    |> verify_from_cookie_key(cookie_key)
    |> Plug.Conn.put_private(@private_key, {param_key, cookie_key})
  end

  defp verify_from_param_key(conn, nil), do: conn

  defp verify_from_param_key(conn, param_key) do
    conn = Plug.Conn.fetch_query_params(conn)
    verify_value(conn, param_key, conn.query_params[param_key])
    conn
  end

  defp verify_from_cookie_key(conn, nil), do: conn

  defp verify_from_cookie_key(conn, cookie_key) do
    conn = Plug.Conn.fetch_cookies(conn)
    verify_value(conn, cookie_key, conn.req_cookies[cookie_key])
    conn
  end

  defp verify_value(conn, key, value) do
    with true <- is_binary(value),
         {:ok, stream} <- Phoenix.Token.verify(conn, key, value, max_age: @max_age) do
      # TODO: Remove || once we support Phoenix v1.5+
      endpoint = conn.private.phoenix_endpoint
      pubsub_server = endpoint.config(:pubsub_server) || endpoint.__pubsub_server__()
      Logger.metadata(logger_pubsub_backend: {pubsub_server, topic(stream)})
    end
  end

  @doc false
  def topic(stream) do
    "phx_dashboard:request_logger:#{stream}"
  end

  @doc false
  def param_key(conn) do
    conn.private[@private_key]
  end

  @doc false
  def sign(endpoint, param_key, stream)
      when is_atom(endpoint) and is_binary(param_key) and is_binary(stream) do
    Phoenix.Token.sign(endpoint, param_key, stream)
  end
end
