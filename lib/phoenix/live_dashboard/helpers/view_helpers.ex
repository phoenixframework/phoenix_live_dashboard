defmodule Phoenix.LiveDashboard.ViewHelpers do
  # General helpers for all views (rendering related).
  @moduledoc false

  import Phoenix.HTML
  import Phoenix.LiveView.Helpers

  @doc """
  Formats MFAs.
  """
  def format_call({m, f, a}), do: Exception.format_mfa(m, f, a)

  @doc """
  Formats the stacktrace.
  """
  def format_stacktrace(stacktrace) do
    stacktrace
    |> Exception.format_stacktrace()
    |> String.split("\n")
    |> Enum.map(&String.replace_prefix(&1, "   ", ""))
    |> Enum.join("\n")
  end

  @doc """
  Formats uptime.
  """
  def format_uptime(uptime) do
    {d, {h, m, _s}} = :calendar.seconds_to_daystime(div(uptime, 1000))

    cond do
      d > 0 -> "#{d}d#{h}h#{m}m"
      h > 0 -> "#{h}h#{m}m"
      true -> "#{m}m"
    end
  end

  @doc """
  Formats bytes.
  """
  def format_bytes(bytes) when is_integer(bytes) do
    cond do
      bytes >= memory_unit(:TB) -> format_bytes(bytes, :TB)
      bytes >= memory_unit(:GB) -> format_bytes(bytes, :GB)
      bytes >= memory_unit(:MB) -> format_bytes(bytes, :MB)
      bytes >= memory_unit(:KB) -> format_bytes(bytes, :KB)
      true -> format_bytes(bytes, :B)
    end
  end

  defp format_bytes(bytes, :B) when is_integer(bytes), do: "#{bytes} B"

  defp format_bytes(bytes, unit) when is_integer(bytes) do
    value = bytes / memory_unit(unit)
    "#{:erlang.float_to_binary(value, decimals: 1)} #{unit}"
  end

  defp memory_unit(:TB), do: 1024 * 1024 * 1024 * 1024
  defp memory_unit(:GB), do: 1024 * 1024 * 1024
  defp memory_unit(:MB), do: 1024 * 1024
  defp memory_unit(:KB), do: 1024

  @doc """
  Shows a hint.
  """
  def hint(do: block) do
    ~E"""
    <div class="hint">
      <svg class="hint-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" fill="none"/>
        <rect x="19" y="10" width="6" height="5.76" rx="1" class="hint-icon-fill"/>
        <rect x="19" y="20" width="6" height="14" rx="1" class="hint-icon-fill"/>
        <circle cx="22" cy="22" r="20" class="hint-icon-stroke" stroke-width="4"/>
      </svg>
      <div class="hint-text"><%= block %></div>
    </div>
    """
  end

  @doc """
  Builds a modal.
  """
  def live_modal(socket, component, opts) do
    path = Keyword.fetch!(opts, :return_to)
    title = Keyword.fetch!(opts, :title)
    modal_opts = [id: :modal, return_to: path, component: component, opts: opts, title: title]
    live_component(socket, Phoenix.LiveDashboard.ModalComponent, modal_opts)
  end
end
