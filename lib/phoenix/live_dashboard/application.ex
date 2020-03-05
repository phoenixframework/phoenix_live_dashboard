defmodule Phoenix.LiveDashboard.Application do
  @moduledoc false
  use Application

  def start(_, _) do
    Logger.add_backend(Phoenix.LiveDashboard.LoggerPubSubBackend)

    children = [
      {DynamicSupervisor, name: Phoenix.LiveDashboard.DynamicSupervisor, strategy: :one_for_one}
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
