defmodule Phoenix.LiveDashboardTest.LinkedWorker do
  def start_link(remote_pid) do
    Agent.start_link(fn ->
      Process.link(remote_pid)
      spawn_link(:timer, :sleep, [:infinity])
    end)
  end
end
