defmodule Phoenix.LiveDashboard.Application do
  @moduledoc false
  use Application

  def start(_, _) do
    children = [
      {DynamicSupervisor, name: Phoenix.LiveDashboard.ListenerSupervisor, strategy: :one_for_one}
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
