defmodule Phoenix.LiveDashboard.SystemInfo do
  @moduledoc false

  def info(node) do
    :rpc.call(node, __MODULE__, :info_callback, [])
  end

  def usage(node) do
    :rpc.call(node, __MODULE__, :usage_callback, [])
  end

  def info_callback do
    %{
      system_info: %{
        banner: :erlang.system_info(:system_version),
        elixir_version: System.version(),
        phoenix_version: Application.spec(:phoenix, :vsn) || "None",
        dashboard_version: Application.spec(:phoenix_live_dashboard, :vsn) || "None",      
        system_architecture: :erlang.system_info(:system_architecture)
      },
      system_limits: %{
        atoms: :erlang.system_info(:atom_limit),
        ports: :erlang.system_info(:port_limit),
        processes: :erlang.system_info(:process_limit)
      },
      system_usage: usage_callback()
    }
  end

  def usage_callback do
    %{
      atoms: :erlang.system_info(:atom_count),
      ports: :erlang.system_info(:port_count),
      processes: :erlang.system_info(:process_count)
    }
  end
end
