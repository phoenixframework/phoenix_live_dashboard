defmodule Phoenix.LiveDashboard.Listener do
  # This module is the one responsible for listening
  # and sending metrics to a given node.
  @moduledoc false
  use GenServer, restart: :temporary

  def listen(node, events) do
    DynamicSupervisor.start_child(
      {Phoenix.LiveDashboard.ListenerSupervisor, node},
      {Phoenix.LiveDashboard.Listener, {self(), events}}
    )
  end

  def start_link({parent, events}) do
    GenServer.start_link(__MODULE__, {parent, events})
  end

  def handle_metrics(event_name, measurements, metadata, parent) do
    send(parent, {event_name, measurements, metadata})
  end

  @impl true
  def init({parent, events}) do
    Process.flag(:trap_exit, true)
    ref = Process.monitor(parent)

    for event <- events do
      id = {__MODULE__, event, self()}
      :telemetry.attach(id, event, &handle_metrics/4, parent)
    end

    {:ok, %{ref: ref, events: events}}
  end

  @impl true
  def handle_info({:DOWN, ref, _, _, _}, %{ref: ref} = state) do
    {:stop, :shutdown, state}
  end

  @impl true
  def terminate(_reason, %{events: events}) do
    for event <- events do
      :telemetry.detach({__MODULE__, event, self()})
    end

    :ok
  end
end
