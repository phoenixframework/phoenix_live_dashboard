defmodule Phoenix.LiveDashboard.SystemInfoTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveDashboard.SystemInfo

  test "format_uptime/1" do
    assert format_uptime(1000) == "0m"
    assert format_uptime(60000) == "1m"
    assert format_uptime(90000) == "1m"
    assert format_uptime(120_000) == "2m"
    assert format_uptime(60 * 60000) == "1h0m"
    assert format_uptime(2 * 60 * 60000) == "2h0m"
    assert format_uptime(24 * 60 * 60000) == "1d0h0m"
    assert format_uptime(25 * 60 * 65000) == "1d3h5m"
  end

  test "format_bytes/1" do
    assert format_bytes(0) == "0 B"
    assert format_bytes(1000) == "1000 B"
    assert format_bytes(1024) == "1.0 KB"
    assert format_bytes(1200) == "1.2 KB"
    assert format_bytes(1024 * 1024) == "1.0 MB"
    assert format_bytes(1024 * 1200) == "1.2 MB"
    assert format_bytes(1024 * 1024 * 1024) == "1.0 GB"
    assert format_bytes(1024 * 1024 * 1200) == "1.2 GB"
    assert format_bytes(1024 * 1024 * 1024 * 1024) == "1.0 TB"
    assert format_bytes(1024 * 1024 * 1024 * 1024 * 1024) == "1024.0 TB"
  end

  test "port callback function limit" do
    {ports, count} = ports_callback("", :input, :asc, 100)
    assert Enum.count(ports) == count
    {ports, count} = ports_callback("", :input, :asc, 1)
    assert Enum.count(ports) == 1
    assert count > 1
  end

  test "port callback function search" do
    {ports, _count} = ports_callback("forker", :input, :asc, 100)
    assert Enum.count(ports) == 1
    [[port, name | _ ] | _] = ports
    assert name == {:name, "forker"}
    assert port == {:port_str, "#Port<0.0>"}
  end

  test "port retrieving function" do
  {ports, count} = fetch_ports(Node.self(), "", :input, :asc, 100)
    assert Enum.count(ports) == count

    ls = Port.open({:spawn, "ls"}, [:binary])
    {ports_1, count_1} = fetch_ports(Node.self(), "", :input, :asc, 100)
    assert count + 1 == count_1
    assert Enum.count(ports_1) == count_1

    Port.close(ls)
    {ports_2, count_2} = fetch_ports(Node.self(), "", :input, :asc, 100)
    assert count  == count_2
    assert Enum.count(ports_2) == count_2
  end

end
