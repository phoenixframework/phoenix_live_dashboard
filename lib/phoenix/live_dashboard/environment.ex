defmodule Phoenix.LiveDashboard.Environment do
  # Helpers for fetching and formatting environment information.
  @moduledoc false

  def fetch_info(nil), do: nil
  def fetch_info(keys) do
    Enum.map(keys, fn key -> {key, System.get_env(key)} end)
  end
end
