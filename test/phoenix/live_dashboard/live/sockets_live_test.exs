defmodule Phoenix.LiveDashboard.SocketsLiveTest do
  use ExUnit.Case, async: false

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "search" do
    %{formatted_address: first_address, port: first_socket_port} = open_socket()
    %{formatted_address: second_address} = open_socket()

    {:ok, live, _} = live(build_conn(), sockets_path(50, "", :send_oct, :desc))
    rendered = render(live)
    assert rendered =~ first_address
    assert rendered =~ second_address
    assert rendered =~ "*:*"
    assert rendered =~ "sockets out of 2"
    assert rendered =~ sockets_href(50, "", :send_oct, :asc)

    {:ok, live, _} = live(build_conn(), sockets_path(50, first_socket_port, :send_oct, :desc))

    rendered = render(live)
    assert rendered =~ first_address
    refute rendered =~ second_address
    assert rendered =~ "sockets out of 1"
    assert rendered =~ sockets_href(50, first_socket_port, :send_oct, :asc)

    {:ok, live, _} = live(build_conn(), sockets_path(50, "localhost", :send_oct, :desc))
    rendered = render(live)
    assert rendered =~ first_address
    assert rendered =~ second_address
    assert rendered =~ "sockets out of 2"
    assert rendered =~ sockets_href(50, "localhost", :send_oct, :asc)
  end

  test "order sockets by local address port" do
    %{formatted_address: address} = open_socket()
    %{formatted_address: other_address} = open_socket()

    [first_address, second_address] = Enum.sort([address, other_address])

    {:ok, live, _} = live(build_conn(), sockets_path(50, "", :local_address, :asc))
    rendered = render(live)
    assert rendered =~ ~r/#{first_address}.*#{second_address}/s
    assert rendered =~ sockets_href(50, "", :local_address, :desc)
    refute rendered =~ sockets_href(50, "", :local_address, :asc)

    rendered =
      render_patch(
        live,
        "/dashboard/nonode@nohost/sockets?limit=50&sort_dir=desc&sort_by=local_address"
      )

    assert rendered =~ ~r/#{second_address}.*#{first_address}/s
    refute rendered =~ ~r/#{first_address}.*#{second_address}/s
    assert rendered =~ sockets_href(50, "", :local_address, :asc)
    refute rendered =~ sockets_href(50, "", :local_address, :desc)

    rendered =
      render_patch(
        live,
        "/dashboard/nonode@nohost/sockets?limit=50&sort_dir=asc&sort_by=local_address"
      )

    assert rendered =~ ~r/#{first_address}.*#{second_address}/s
    refute rendered =~ ~r/#{second_address}.*#{first_address}/s
    assert rendered =~ sockets_href(50, "", :local_address, :desc)
    refute rendered =~ sockets_href(50, "", :local_address, :asc)
  end

  test "shows socket info modal" do
    %{socket: socket, formatted_address: address} = open_socket()

    {:ok, live, _} = live(build_conn(), socket_info_path(socket, 50, :send_oct, :asc))
    rendered = render(live)
    assert rendered =~ sockets_href(50, "", :send_oct, :asc)

    assert rendered =~ "modal-content"
    assert rendered =~ ~r/Local Address.*#{address}/

    refute live |> element("#modal .close") |> render_click() =~ "modal"
    return_path = sockets_path(50, "", :send_oct, :asc)
    assert_patch(live, return_path)
  end

  defp sockets_href(limit, search, sort_by, sort_dir) do
    ~s|href="#{Plug.HTML.html_escape_to_iodata(sockets_path(limit, search, sort_by, sort_dir))}"|
  end

  defp socket_info_path(port, limit, sort_by, sort_dir) do
    sockets_path(limit, "", sort_by, sort_dir) <>
      "&info=#{Phoenix.LiveDashboard.LiveHelpers.encode_port(port)}"
  end

  defp sockets_path(limit, search, sort_by, sort_dir) do
    "/dashboard/nonode%40nohost/sockets?" <>
      "limit=#{limit}&search=#{search}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end

  defp open_socket() do
    with {:ok, socket} <- :gen_tcp.listen(0, ip: {127, 0, 0, 1}),
         {:ok, {_, port}} <- :inet.sockname(socket) do
      %{formatted_address: "localhost:#{port}", socket: socket, ip: "localhost", port: port}
    end
  end
end
