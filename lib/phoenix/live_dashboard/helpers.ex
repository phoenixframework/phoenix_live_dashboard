defmodule Phoenix.LiveDashboard.Helpers do
  @moduledoc false

  alias Phoenix.LiveDashboard.{PageBuilder, SystemInfo}
  use Phoenix.Component

  alias SystemInfo.{ProcessDetails, PortDetails}
  @format_limit 100

  @doc """
  Formats any value.
  """
  def format_value(%ProcessDetails{} = info, live_dashboard_path) do
    %{pid: pid, name_or_initial_call: name_or_initial_call} = info

    text =
      if name_or_initial_call do
        "#{inspect(pid)} (#{name_or_initial_call})"
      else
        inspect(pid)
      end

    assigns = %{
      to: live_dashboard_path.(node(pid), info: PageBuilder.encode_pid(pid)),
      text: text
    }

    ~H|<.link patch={@to}><%= @text %></.link>|
  end

  def format_value(%PortDetails{} = info, live_dashboard_path) do
    %{port: port, description: description} = info

    assigns = %{
      to: live_dashboard_path.(node(port), info: PageBuilder.encode_port(port)),
      text: "#{inspect(port)} (#{description})"
    }

    ~H|<.link patch={@to}><%= @text %></.link>|
  end

  # Not used in `phoenix_live_dashboard` code, but available for custom pages
  def format_value(port, live_dashboard_path) when is_port(port) do
    assigns = %{
      to: live_dashboard_path.(node(port), info: PageBuilder.encode_port(port)),
      text: inspect(port)
    }

    ~H|<.link patch={@to}><%= @text %></.link>|
  end

  # Not used in `phoenix_live_dashboard` code, but available for custom pages
  def format_value(pid, live_dashboard_path) when is_pid(pid) do
    assigns = %{
      to: live_dashboard_path.(node(pid), info: PageBuilder.encode_pid(pid)),
      text: inspect(pid)
    }

    ~H|<.link patch={@to}><%= @text %></.link>|
  end

  def format_value([_ | _] = list, live_dashboard_path) do
    {entries, left_over} = Enum.split(list, @format_limit)

    entries
    |> Enum.map(&format_value(&1, live_dashboard_path))
    |> Kernel.++(if left_over == [], do: [], else: ["..."])
    |> Enum.intersperse({:safe, "<br />"})
  end

  def format_value(other, _socket), do: inspect(other, pretty: true, limit: @format_limit)

  @doc """
  Formats initial calls.

  Same as `format_call` but takes into account Supervisor's special format.
  """
  def format_initial_call({:supervisor, mod, arity}), do: format_call({mod, :init, arity})
  def format_initial_call(call), do: format_call(call)

  @doc """
  Formats MFAs.
  """
  def format_call(:undefined), do: "undefined"
  def format_call({m, f, a}), do: Exception.format_mfa(m, f, a)

  @doc """
  Formats the stacktrace.
  """
  def format_stacktrace(stacktrace) do
    stacktrace
    |> Exception.format_stacktrace()
    |> String.split("\n")
    |> Enum.map(&String.replace_prefix(&1, "    ", ""))
    |> Enum.join("\n")
  end

  @format_path_regex ~r/^(?<beginning>((.+?\/){3})).*(?<ending>(\/.*){3})$/

  @doc """
  Formats large paths by removing intermediate parts.
  """
  def format_path(path) do
    path_string =
      path
      |> to_string()
      |> String.replace_prefix("\"", "")
      |> String.replace_suffix("\"", "")

    case Regex.named_captures(@format_path_regex, path_string) do
      %{"beginning" => beginning, "ending" => ending} -> "#{beginning}...#{ending}"
      _ -> path_string
    end
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
  Formats percent.
  """
  def format_percent(percent) when is_float(percent), do: "#{Float.round(percent, 1)}%"
  def format_percent(nil), do: "0%"
  def format_percent(percent), do: "#{percent}%"

  @doc """
  Formats words as bytes.
  """
  def format_words(words) when is_integer(words) do
    format_bytes(words * :erlang.system_info(:wordsize))
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
  Computes the percentage between `value` and `total`.
  """
  def percentage(value, total, rounds \\ 1)
  def percentage(_value, 0, _rounds), do: 0
  def percentage(nil, _total, _rounds), do: 0
  def percentage(value, total, rounds), do: Float.round(value / total * 100, rounds)

  @doc """
  All connected nodes (including the current node).
  """
  def nodes(), do: [node()] ++ Node.list(:connected)
end
