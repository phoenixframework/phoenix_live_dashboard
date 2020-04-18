defmodule Phoenix.LiveDashboardTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "embeds phx-socket information" do
    assert build_conn() |> get("/dashboard/nonode@nohost") |> html_response(200) =~
             ~s|phx-socket="/live"|
  end
end
