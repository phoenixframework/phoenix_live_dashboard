defmodule Phoenix.LiveDashboard.ViewHelpers do
  # General helpers for all views (rendering related).
  @moduledoc false

  import Phoenix.LiveView.Helpers
  @format_limit 100
  @format_path_regex ~r/^(?<beginning>((.+?\/){3})).*(?<ending>(\/.*){3})$/

  @doc """
  Encodes references for URLs.
  """
  def encode_reference(ref) do
    ref
    |> :erlang.ref_to_list()
    |> Enum.drop(5)
    |> Enum.drop(-1)
    |> List.to_string()
  end

  @doc """
  Decodes the reference from URL.
  """
  def decode_reference(list_ref) do
    :erlang.list_to_ref('#Ref<' ++ String.to_charlist(list_ref) ++ '>')
  end

  @doc """
  Encodes PIDs for URLs.
  """
  def encode_pid(pid) do
    pid
    |> :erlang.pid_to_list()
    |> tl()
    |> Enum.drop(-1)
    |> List.to_string()
  end

  @doc """
  Decodes the PID from URL.
  """
  def decode_pid(list_pid) do
    :erlang.list_to_pid([?<] ++ String.to_charlist(list_pid) ++ [?>])
  end

  @doc """
  Encodes Port for URLs.
  """
  def encode_port(port) when is_port(port) do
    port
    |> :erlang.port_to_list()
    |> Enum.drop(6)
    |> Enum.drop(-1)
    |> List.to_string()
  end

  @doc """
  Decodes the Port from URL.
  """
  def decode_port(port_str) do
    :erlang.list_to_port('#Port<' ++ String.to_charlist(port_str) ++ '>')
  end

  @doc """
  Formats any value.
  """
  def format_value(port, live_dashboard_path) when is_port(port) do
    live_redirect(inspect(port), to: live_dashboard_path.(:ports, node(port), [encode_port(port)]))
  end

  def format_value(pid, live_dashboard_path) when is_pid(pid) do
    live_redirect(inspect(pid), to: live_dashboard_path.(:processes, node(pid), [encode_pid(pid)]))
  end

  def format_value([_ | _] = list, live_dashboard_path) do
    {entries, left_over} = Enum.split(list, @format_limit)

    entries
    |> Enum.map(&format_value(&1, live_dashboard_path))
    |> Kernel.++(if left_over == [], do: [], else: ["..."])
    |> Enum.intersperse({:safe, "<br />"})
  end

  def format_value(other, _link_builder), do: inspect(other, pretty: true, limit: @format_limit)

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
    |> Enum.map(&String.replace_prefix(&1, "    ", ""))
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
  Formats percent.
  """
  def format_percent(percent) when is_float(percent) do
    "#{Float.round(percent, 1)}%"
  end

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

  def percentage(value, total, rounds \\ 1)
  def percentage(_value, 0, _rounds), do: 0
  def percentage(nil, _total, _rounds), do: 0
  def percentage(value, total, rounds), do: Float.round(value / total * 100, rounds)

  @doc """
  Formats path.
  """
  def format_path(path) do
    path_string = to_string(path)
    Regex.named_captures(@format_path_regex, path_string)
    |> case do
      %{"beginning" => beginning, "ending" => ending} -> "#{beginning}...#{ending}"
      _ -> path_string
    end

  end

  @doc """
  Shows a hint.
  """
  def hint(do: block) do
    assigns = %{block: block}

    ~L"""
    <div class="hint">
      <svg class="hint-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" fill="none"/>
        <rect x="19" y="10" width="6" height="5.76" rx="1" class="hint-icon-fill"/>
        <rect x="19" y="20" width="6" height="14" rx="1" class="hint-icon-fill"/>
        <circle cx="22" cy="22" r="20" class="hint-icon-stroke" stroke-width="4"/>
      </svg>
      <div class="hint-text"><%= @block %></div>
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
