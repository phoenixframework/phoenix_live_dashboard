defmodule Phoenix.LiveDashboardTest do
  use ExUnit.Case, async: true

  import Plug.Conn
  import Phoenix.ConnTest

  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "embeds phx-socket information" do
    assert build_conn() |> get("/dashboard/nonode@nohost/home") |> html_response(200) =~
             ~s|phx-socket="/live"|

    assert build_conn() |> get("/config/nonode@nohost/home") |> html_response(200) =~
             ~s|phx-socket="/custom/live"|
  end

  test "embeds csp nonces" do
    refute build_conn()
           |> assign(:csp_nonce, "abcdef")
           |> get("/dashboard/nonode@nohost/home")
           |> html_response(200) =~ "abcdef"

    assert build_conn()
           |> assign(:csp_nonce, "abcdef")
           |> get("/config/nonode@nohost/home")
           |> html_response(200) =~
             ~s|<script nonce="abcdef">|
  end

  @tag :integration
  test "compiles as a dep without optional deps" do
    File.rm_rf!("tmp/as_a_dep")
    File.mkdir_p!("tmp/as_a_dep")

    File.cd!("tmp/as_a_dep", fn ->
      File.write!("mix.exs", """
      defmodule DepsOnDashboard.MixProject do
        use Mix.Project

        def project do
          [
            app: :deps_on_dashboard,
            version: "0.0.1",
            deps_path: "../../deps",
            lockfile: "../../mix.lock",
            deps: [{:phoenix_live_dashboard, path: "../.."}]
          ]
        end
      end
      """)

      assert {_, 0} = System.cmd("mix", ["compile"], stderr_to_stdout: true)
    end)
  end
end
