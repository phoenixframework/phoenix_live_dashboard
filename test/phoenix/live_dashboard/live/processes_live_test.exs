defmodule Phoenix.LiveDashboard.ProcessesLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "shows processes with limit" do
    {:ok, live, rendered} = live(build_conn(), "/dashboard/nonode@nohost/processes")
    assert rendered |> :binary.matches("</tr>") |> length() <= 100

    rendered = render_patch(live, "/dashboard/nonode@nohost/processes?limit=1000")
    assert rendered |> :binary.matches("</tr>") |> length() > 100
  end

  test "search" do
    Agent.start_link(fn -> :ok end, name: Foo1)
    Agent.start_link(fn -> :ok end, name: Foo2)
    {:ok, pid} = Agent.start_link(fn -> :ok end, name: :erlang_bar)

    {:ok, live, _} = live(build_conn(), processes_path(1000, "FOO", :message_queue_len, :desc))
    rendered = render(live)
    assert rendered =~ ~r/Foo1.*Foo2/
    refute rendered =~ ":erlang_bar"
    assert rendered =~ "processes out of 2"
    assert rendered =~ processes_href(1000, "FOO", :message_queue_len, :asc)

    {:ok, live, _} =
      live(build_conn(), processes_path(1000, ":erlang_bar", :message_queue_len, :desc))

    rendered = render(live)
    assert rendered =~ ~r/:erlang_bar/
    assert rendered =~ "processes out of 1"

    pid = pid |> :erlang.pid_to_list() |> List.to_string()
    {:ok, live, _} = live(build_conn(), processes_path(1000, pid, :message_queue_len, :desc))
    rendered = render(live)
    assert rendered =~ ":erlang_bar"
    assert rendered =~ "processes out of 1"
  end

  test "order processes by memory" do
    Agent.start_link(fn -> List.duplicate("a", 1) end, name: :process_live_test_low_memory)
    Agent.start_link(fn -> List.duplicate("a", 1000) end, name: :process_live_test_high_memory)

    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/processes?limit=1000")
    rendered = render(live)
    assert rendered =~ ~r/:process_live_test_high_memory.*:process_live_test_low_memory/
    assert rendered =~ processes_href(1000, "", :memory, :asc)
    refute rendered =~ processes_href(1000, "", :memory, :desc)

    rendered = render_patch(live, "/dashboard/nonode@nohost/processes?limit=1000&sort_dir=asc")
    assert rendered =~ ~r/:process_live_test_low_memory.*:process_live_test_high_memory/
    assert rendered =~ processes_href(1000, "", :memory, :desc)
    refute rendered =~ processes_href(1000, "", :memory, :asc)
  end

  test "order processes by reductions" do
    Agent.start_link(fn -> List.duplicate("a", 1) end, name: :process_live_test_low_reductions)

    Agent.start_link(fn -> List.duplicate("a", 1000) end, name: :process_live_test_high_reductions)

    {:ok, live, _} = live(build_conn(), processes_path(1000, "", :reductions, :desc))
    rendered = render(live)
    assert rendered =~ ~r/:process_live_test_high_reductions.*:process_live_test_low_reductions/
    assert rendered =~ processes_href(1000, "", :reductions, :asc)
    refute rendered =~ processes_href(1000, "", :reductions, :desc)

    rendered = render_patch(live, processes_path(1000, "", :reductions, :asc))
    assert rendered =~ ~r/:process_live_test_low_reductions.*:process_live_test_high_reductions/
    assert rendered =~ processes_href(1000, "", :reductions, :desc)
    refute rendered =~ processes_href(1000, "", :reductions, :asc)
  end

  test "order processes by message queue len" do
    {:ok, pid} = Task.start_link(fn -> Process.sleep(:infinity) end)
    Process.register(pid, :process_live_test_low_msgq)
    {:ok, pid} = Task.start_link(fn -> Process.sleep(:infinity) end)
    Process.register(pid, :process_live_test_high_msgq)
    Enum.each(1..1000, &send(pid, {:msg, &1}))

    {:ok, live, _} = live(build_conn(), processes_path(1000, "", :message_queue_len, :desc))
    rendered = render(live)
    assert rendered =~ ~r/:process_live_test_high_msgq.*:process_live_test_low_msgq/
    assert rendered =~ processes_href(1000, "", :message_queue_len, :asc)
    refute rendered =~ processes_href(1000, "", :message_queue_len, :desc)

    rendered = render_patch(live, processes_path(1000, "", :message_queue_len, :asc))
    assert rendered =~ ~r/:process_live_test_low_msgq.*:process_live_test_high_msgq/
    assert rendered =~ processes_href(1000, "", :message_queue_len, :desc)
    refute rendered =~ processes_href(1000, "", :message_queue_len, :asc)
  end

  test "shows process info modal" do
    {:ok, pid} = Task.start_link(fn -> Process.sleep(:infinity) end)
    Process.register(pid, :selected_process)

    {:ok, live, _} = live(build_conn(), process_info_path(pid, 1000, :message_queue_len, :desc))
    rendered = render(live)
    assert rendered =~ processes_href(1000, "", :message_queue_len, :desc)

    assert rendered =~ "modal-content"
    assert rendered =~ ~r/Registered name.*selected_process/

    refute live |> element("#modal .close") |> render_click() =~ "modal"
    return_path = processes_path(1000, "", :message_queue_len, :desc)
    assert_patch(live, return_path)
  end

  defp processes_href(limit, search, sort_by, sort_dir) do
    ~s|href="#{Plug.HTML.html_escape_to_iodata(processes_path(limit, search, sort_by, sort_dir))}"|
  end

  defp process_info_path(pid, limit, sort_by, sort_dir) do
    processes_path(limit, "", sort_by, sort_dir) <>
      "&info=#{Phoenix.LiveDashboard.LiveHelpers.encode_pid(pid)}"
  end

  defp processes_path(limit, search, sort_by, sort_dir) do
    "/dashboard/nonode%40nohost/processes?" <>
      "limit=#{limit}&search=#{search}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end
end
