defmodule Phoenix.LiveDashboard.SystemInfo do
  # Helpers for fetching and formatting system info.
  @moduledoc false

  ## Formatters

  def format_call({m, f, a}), do: Exception.format_mfa(m, f, a)

  def format_uptime(uptime) do
    {d, {h, m, _s}} = :calendar.seconds_to_daystime(div(uptime, 1000))

    cond do
      d > 0 -> "#{d}d#{h}h#{m}m"
      h > 0 -> "#{h}h#{m}m"
      true -> "#{m}m"
    end
  end

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

  ## Fetchers

  def fetch_processes(node, search, sort_by, sort_dir, limit) do
    search = search && String.downcase(search)
    :rpc.call(node, __MODULE__, :processes_callback, [search, sort_by, sort_dir, limit])
  end

  def fetch_process_info(pid, keys) do
    :rpc.call(node(pid), __MODULE__, :process_info_callback, [pid, keys])
  end

  def fetch_info(node) do
    :rpc.call(node, __MODULE__, :info_callback, [])
  end

  def fetch_usage(node) do
    :rpc.call(node, __MODULE__, :usage_callback, [])
  end

  ## Callbacks

  @process_info [
    :registered_name,
    :initial_call,
    :memory,
    :reductions,
    :message_queue_len,
    :current_function
  ]

  defp sort_dir_multipler(:asc), do: 1
  defp sort_dir_multipler(:desc), do: -1

  @doc false
  def processes_callback(search, sort_by, sort_dir, limit) do
    multiplier = sort_dir_multipler(sort_dir)

    processes =
      for pid <- Process.list(), info = info(pid), show?(info, search) do
        sorter = info[sort_by] * multiplier
        {sorter, info}
      end

    count = if search, do: length(processes), else: :erlang.system_info(:process_count)
    processes = processes |> Enum.sort() |> Enum.take(limit) |> Enum.map(&elem(&1, 1))
    {processes, count}
  end

  defp info(pid) do
    if info = Process.info(pid, @process_info) do
      [{:registered_name, name}, {:initial_call, initial_call} | rest] = info
      name_or_initial_call = if is_atom(name), do: inspect(name), else: format_call(initial_call)
      [pid: pid, name_or_initial_call: name_or_initial_call] ++ rest
    end
  end

  defp show?(_, nil) do
    true
  end

  defp show?(info, search) do
    pid = info[:pid] |> :erlang.pid_to_list() |> List.to_string()
    name_or_call = info[:name_or_initial_call]
    pid =~ search or String.downcase(name_or_call) =~ search
  end

  @doc false
  def process_info_callback(pid, keys) do
    case Process.info(pid, keys) do
      [_ | _] = info -> {:ok, info}
      nil -> :error
    end
  end

  @doc false
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

  @doc false
  def usage_callback do
    %{
      atoms: :erlang.system_info(:atom_count),
      ports: :erlang.system_info(:port_count),
      processes: :erlang.system_info(:process_count),
      io: io(),
      uptime: :erlang.statistics(:wall_clock) |> elem(0),
      memory: memory(),
      total_run_queue: :erlang.statistics(:total_run_queue_lengths_all),
      cpu_run_queue: :erlang.statistics(:total_run_queue_lengths)
    }
  end

  defp io() do
    {{:input, input}, {:output, output}} = :erlang.statistics(:io)
    {input, output}
  end

  defp memory() do
    memory = :erlang.memory()
    total = memory[:total]
    process = memory[:processes]
    atom = memory[:atom]
    binary = memory[:binary]
    code = memory[:code]
    ets = memory[:ets]

    %{
      total: total,
      process: process,
      atom: atom,
      binary: binary,
      code: code,
      ets: ets,
      other: total - process - atom - binary - code - ets
    }
  end
end
