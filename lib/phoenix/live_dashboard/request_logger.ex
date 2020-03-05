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
    param_key =
      opts[:param_key] ||
        raise ArgumentError,
              "the name of the parameter to log must be given to Phoenix.LiveDashboard.RequestLogger"

    param_key
  end

  @impl true
  def call(conn, param_key) do
    conn = Plug.Conn.fetch_query_params(conn)

    with signed_param when is_binary(signed_param) <- conn.query_params[param_key],
         {:ok, stream} <- Phoenix.Token.verify(conn, param_key, signed_param, max_age: @max_age) do
      endpoint = conn.private.phoenix_endpoint
      # TODO: Remove || once we support Phoenix v1.5+
      pubsub_server = endpoint.config(:pubsub_server) || endpoint.__pubsub_server__()
      Logger.metadata(logger_pubsub_backend: {pubsub_server, topic(stream)})
    end

    Plug.Conn.put_private(conn, @private_key, param_key)
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
