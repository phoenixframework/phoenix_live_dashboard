defmodule Phoenix.LiveDashboard.Application do
  @moduledoc false
  use Application

  def start(_, _) do
    # Preload it as we check if it is available on remote nodes
    Code.ensure_loaded(Phoenix.LiveDashboard.SystemInfo)

    if function_exported?(Logger, :default_formatter, 0) do
      :ok =
        :logger.add_handler(
          Phoenix.LiveDashboard.LoggerPubSubBackend,
          Phoenix.LiveDashboard.LoggerPubSubBackend,
          %{formatter: Logger.default_formatter(colors: [enabled: false])}
        )
    else
      Logger.add_backend(Phoenix.LiveDashboard.LoggerPubSubBackend)
    end

    children = [
      {DynamicSupervisor, name: Phoenix.LiveDashboard.DynamicSupervisor, strategy: :one_for_one}
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
