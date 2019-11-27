defmodule Phoenix.LiveDashboard do
  @moduledoc """
  Phoenix LiveDashboard agent.
  """
  use Agent

  def start_link(opts) do
    metrics =
      opts[:metrics] ||
        raise ArgumentError, "the :metrics option is required by #{inspect(__MODULE__)}"

    Agent.start_link(fn -> %{metrics: metrics} end, name: __MODULE__)
  end
end
