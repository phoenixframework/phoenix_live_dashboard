defmodule Phoenix.LiveDashboard.LayoutViewTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  alias Phoenix.LiveDashboard.LayoutView

  describe "live_socket_path" do
    test "considers script_name" do
      assert LayoutView.live_socket_path(build_conn()) |> to_string() ==
               "/live"

      assert LayoutView.live_socket_path(%{build_conn() | script_name: ~w(foo bar)})
             |> to_string() ==
               "/foo/bar/live"
    end
  end
end
