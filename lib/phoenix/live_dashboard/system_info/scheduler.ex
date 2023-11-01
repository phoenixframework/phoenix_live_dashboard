defmodule Phoenix.LiveDashboard.SystemInfo.Scheduler do
  # Genserver to measure scheduler utilization
  @moduledoc false

  use GenServer
  require Logger

  def start_link() do
    GenServer.start_link(__MODULE__, [])
  end

  def utilization(pid) do
    GenServer.call(pid, :utilization)
  end

  @impl GenServer
  def init(_) do
    Process.flag(:trap_exit, true)
    :erlang.system_flag(:scheduler_wall_time, true)
    sample = :scheduler.get_sample()

    {:ok, %{last_sample: sample, last_timestamp: DateTime.utc_now()}}
  end

  @impl GenServer
  def handle_call(:utilization, _caller, state) do
    %{last_sample: last_sample, last_timestamp: last_timestamp} = state
    new_sample = :scheduler.get_sample()
    new_timestamp = DateTime.utc_now()
    utilization = :scheduler.utilization(new_sample, last_sample)

    reply = {utilization, {last_timestamp, new_timestamp}}

    {:reply, reply, %{last_sample: new_sample, last_timestamp: new_timestamp}}
  end

  @impl GenServer
  def handle_info(msg, state) do
    Logger.warning("Unexpected msg received: #{inspect(msg)}")
    {:noreply, state}
  end

  @impl GenServer
  def terminate(_, _) do
    :erlang.system_flag(:scheduler_wall_time, false)
  end
end
