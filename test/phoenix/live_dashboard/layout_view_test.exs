defmodule Phoenix.LiveDashboard.LayoutViewTest do
  use ExUnit.Case, async: true

  import Plug.Conn
  import Phoenix.ConnTest
  alias Phoenix.LiveDashboard.LayoutView

  describe "live_socket_path" do
    test "considers script_name" do
      conn = put_private(build_conn(), :live_socket_path, "/live")
      assert LayoutView.live_socket_path(conn) |> to_string() == "/live"

      conn = %{conn | script_name: ~w(foo bar)}
      assert LayoutView.live_socket_path(conn) |> to_string() == "/foo/bar/live"

      conn = put_private(conn, :live_socket_path, "/custom/live")
      assert LayoutView.live_socket_path(conn) |> to_string() == "/foo/bar/custom/live"
    end
  end
end
