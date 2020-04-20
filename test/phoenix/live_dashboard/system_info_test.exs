defmodule Phoenix.LiveDashboard.SystemInfoTest do
  use ExUnit.Case, async: true
  alias Phoenix.LiveDashboard.SystemInfo


  test "port callback function limit" do
    {ports, count} = SystemInfo.ports_callback("", :input, :asc, 100)
    assert Enum.count(ports) == count
    {ports, count} = SystemInfo.ports_callback("", :input, :asc, 1)
    assert Enum.count(ports) == 1
    assert count > 1
  end

  test "port callback function search" do
    {ports, _count} = SystemInfo.ports_callback("forker", :input, :asc, 100)
    assert Enum.count(ports) == 1
    [[port, name | _ ] | _] = ports
    assert name == {:name, "forker"}
    assert port == {:port_str, "#Port<0.0>"}
  end

  test "port retrieving function" do
  {ports, count} = SystemInfo.fetch_ports(Node.self(), "", :input, :asc, 100)
    assert Enum.count(ports) == count

    sleep = Port.open({:spawn, "sleep 10"}, [:binary])
    {ports_1, count_1} = SystemInfo.fetch_ports(Node.self(), "", :input, :asc, 100)
    assert count + 1 == count_1
    assert Enum.count(ports_1) == count_1

    Port.close(sleep)
    {ports_2, count_2} = SystemInfo.fetch_ports(Node.self(), "", :input, :asc, 100)
    assert count  == count_2
    assert Enum.count(ports_2) == count_2
  end

  test "port info callback" do
    port = 
      '#Port<0.0>'
      |> :erlang.list_to_port()
      |> Port.info()

    assert port[:name] == 'forker'
    assert inspect(port[:connected]) == "#PID<0.0.0>"
  end
end
