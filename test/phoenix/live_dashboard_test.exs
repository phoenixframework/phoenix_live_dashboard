defmodule Phoenix.LiveDashboardTest do
  use ExUnit.Case, async: true

  import Plug.Conn
  import Phoenix.ConnTest

  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "embeds phx-socket information" do
    assert build_conn() |> get("/dashboard/nonode@nohost/home") |> html_response(200) =~
             ~s|phx-socket="/live"|
  end

  test "embeds csp nonces" do
    assert build_conn()
           |> assign(:csp_nonce, "abcdef")
           |> get("/dashboard/nonode@nohost/home")
           |> html_response(200) =~
             ~s|<script nonce="abcdef">|
  end
end
