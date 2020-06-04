defmodule Phoenix.LiveDashboard.Application do
  @moduledoc false
  use Application

  def start(_, _) do
    # Preload it as we check if it is available on remote nodes
    Code.ensure_loaded(Phoenix.LiveDashboard.SystemInfo)
    Logger.add_backend(Phoenix.LiveDashboard.LoggerPubSubBackend)

    children = [
      {DynamicSupervisor, name: Phoenix.LiveDashboard.DynamicSupervisor, strategy: :one_for_one}
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
