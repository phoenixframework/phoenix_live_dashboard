defmodule Phoenix.LiveDashboard.LiveHelpersTest do
  use ExUnit.Case, async: true

  import Phoenix.LiveDashboard.LiveHelpers

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

  test "format_words/1" do
    formatted = format_words(4)
    assert formatted == "16 B" or formatted == "32 B"
  end

  test "format_path/1" do
    assert format_path("") == ""
    assert format_path("command -a -b") == "command -a -b"
    assert format_path("/one/two/three/four") == "/one/two/three/four"
    assert format_path("/one/two/three/four/five/six") == "/one/two/three/four/five/six"

    assert format_path("/one/two/three/four/five/six/seven") ==
             "/one/two/three/.../five/six/seven"

    assert format_path("/one/two/three/four/five/six/seven/eight") ==
             "/one/two/three/.../six/seven/eight"

    assert format_path("\"/one/two/three/four/five/six/seven/eight\"") ==
             "/one/two/three/.../six/seven/eight"
  end
end
