defmodule Phoenix.LiveDashboard.SystemInfoTest do
  use ExUnit.Case, async: true
  alias Phoenix.LiveDashboard.SystemInfo

  describe "processes" do
    test "all with limit" do
      {processes, count} = SystemInfo.fetch_processes(node(), "", :memory, :asc, 5000)
      assert Enum.count(processes) == count
      {processes, count} = SystemInfo.fetch_processes(node(), "", :memory, :asc, 1)
      assert Enum.count(processes) == 1
      assert count > 1
    end

    test "all with search" do
      {pids, _count} = SystemInfo.fetch_processes(node(), "user", :memory, :asc, 100)
      assert [[pid, name | _]] = pids
      assert pid == {:pid, Process.whereis(:user)}
      assert name == {:name_or_initial_call, ":user"}
    end

    test "info" do
      {:ok, pid} =
        SystemInfo.fetch_process_info(Process.whereis(:user), [
          :registered_name,
          :message_queue_len
        ])

      assert pid[:registered_name] == :user
      assert is_integer(pid[:message_queue_len])
    end
  end

  describe "ports" do
    test "all with limit" do
      {ports, count} = SystemInfo.fetch_ports(node(), "", :input, :asc, 100)
      assert Enum.count(ports) == count
      {ports, count} = SystemInfo.fetch_ports(node(), "", :input, :asc, 1)
      assert Enum.count(ports) == 1
      assert count > 1
    end

    test "all with search" do
      {ports, _count} = SystemInfo.fetch_ports(node(), "forker", :input, :asc, 100)
      assert [[port, name | _]] = ports
      assert port == {:port, hd(Port.list())}
      assert name == {:name, 'forker'}
    end

    test "info" do
      {:ok, port} = SystemInfo.fetch_port_info(hd(Port.list()), [:name, :connected])
      assert port[:name] == 'forker'
      assert inspect(port[:connected]) == "#PID<0.0.0>"
    end
  end

  describe "ets" do
    test "all with limit" do
      {ets, count} = SystemInfo.fetch_ets(node(), "", :memory, :asc, 100)
      assert Enum.count(ets) == count
      {ets, count} = SystemInfo.fetch_ets(node(), "", :memory, :asc, 1)
      assert Enum.count(ets) == 1
      assert count > 1
    end

    test "all with search" do
      {ets, _count} = SystemInfo.fetch_ets(node(), "ac_tab", :memory, :asc, 100)
      assert [[name | _]] = ets
      assert name == {:name, ":ac_tab"}
    end

    test "info" do
      {:ok, ets} = SystemInfo.fetch_ets_info(node(), :ac_tab)
      assert ets[:name] == :ac_tab
    end
  end

  describe "sockets" do
    test "all with limit" do
      open_socket()
      open_socket()

      {sockets, count} = SystemInfo.fetch_sockets(node(), "", :input, :asc, 100)
      assert Enum.count(sockets) == count
      {sockets, count} = SystemInfo.fetch_sockets(node(), "", :input, :asc, 1)
      assert Enum.count(sockets) == 1
      assert count > 1
    end

    test "all with search" do
      open_socket()

      {[socket], _count} = SystemInfo.fetch_sockets(node(), "*:*", :input, :asc, 100)
      assert socket[:foreign_address] == "*:*"
      {sockets, _count} = SystemInfo.fetch_sockets(node(), "impossible", :input, :asc, 100)
      assert Enum.empty?(sockets)
    end
  end

  describe "os_mon" do
    test "gets all data" do
      assert %{
               cpu_avg1: cpu_avg1,
               cpu_avg5: cpu_avg5,
               cpu_avg15: cpu_avg15,
               cpu_nprocs: cpu_nprocs,
               cpu_per_core: cpu_per_core,
               disk: disk,
               system_mem: system_mem
             } = SystemInfo.fetch_os_mon_info(node())

      assert is_integer(cpu_avg1)
      assert is_integer(cpu_avg5)
      assert is_integer(cpu_avg15)
      assert is_integer(cpu_nprocs)
      assert is_list(cpu_per_core)
      assert is_list(disk)
      assert is_list(system_mem)
    end
  end

  describe "applications" do
    test "all with limit" do
      {applications, count} = SystemInfo.fetch_applications(node(), "", :name, :asc, 100)
      assert Enum.count(applications) == count
      {applications, count} = SystemInfo.fetch_applications(node(), "", :name, :asc, 1)
      assert Enum.count(applications) == 1
      assert count > 1
    end

    test "all with search" do
      {[applications], _count} =
        SystemInfo.fetch_applications(node(), "ex_unit", :name, :asc, 100)

      assert applications[:name] == :ex_unit

      {applications, _count} =
        SystemInfo.fetch_applications(node(), "impossible", :name, :asc, 100)

      assert applications == []
    end
  end

  defp open_socket() do
    {:ok, socket} = :gen_tcp.listen(0, ip: {127, 0, 0, 1})
    socket
  end
end
