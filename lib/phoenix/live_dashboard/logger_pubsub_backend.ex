defmodule Phoenix.LiveDashboard.LoggerPubSubBackend do
  @moduledoc false

  @behaviour :gen_event

  @impl true
  def init(_) do
    config = Application.get_env(:logger, :console)
    format = Logger.Formatter.compile(Keyword.get(config, :format))
    metadata = Keyword.get(config, :metadata, []) |> configure_metadata()
    {:ok, {format, metadata}}
  end

  @impl true
  def handle_call({:configure, _options}, state) do
    {:ok, :ok, state}
  end

  @impl true
  def handle_event({level, gl, {Logger, msg, ts, metadata}}, {format, keys} = state)
      when node(gl) == node() do
    with {pubsub, topic} <- metadata[:logger_pubsub_backend] do
      metadata = take_metadata(metadata, keys)
      formatted = Logger.Formatter.format(format, level, msg, ts, metadata)
      Phoenix.PubSub.broadcast(pubsub, topic, {:logger, level, formatted})
    end

    {:ok, state}
  end

  def handle_event(_, state) do
    {:ok, state}
  end

  @impl true
  def handle_info(_, state) do
    {:ok, state}
  end

  defp configure_metadata(:all), do: :all
  defp configure_metadata(metadata), do: Enum.reverse(metadata)

  defp take_metadata(metadata, :all) do
    metadata
  end

  defp take_metadata(metadata, keys) do
    Enum.reduce(keys, [], fn key, acc ->
      case Keyword.fetch(metadata, key) do
        {:ok, val} -> [{key, val} | acc]
        :error -> acc
      end
    end)
  end
end
