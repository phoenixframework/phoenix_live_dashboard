defmodule Phoenix.LiveDashboard.ProcessesLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "menu_link/2" do
    assert {:ok, "Processes"} = Phoenix.LiveDashboard.ProcessesPage.menu_link(nil, nil)
  end

  test "shows processes with limit" do
    {:ok, live, rendered} = live(build_conn(), "/dashboard/processes")
    assert rendered |> :binary.matches("</tr>") |> length() <= 100

    rendered = render_patch(live, "/dashboard/processes?limit=1000")
    assert rendered |> :binary.matches("</tr>") |> length() > 100
  end

  test "search" do
    Agent.start_link(fn -> :ok end, name: Foo1)
    Agent.start_link(fn -> :ok end, name: Foo2)
    {:ok, pid} = Agent.start_link(fn -> :ok end, name: :erlang_bar)

    {:ok, live, _} = live(build_conn(), processes_path(1000, "FOO", :message_queue_len, :desc))
    rendered = render(live)
    assert rendered =~ ~r/Foo1.*Foo2/s
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

    {:ok, live, _} = live(build_conn(), "/dashboard/processes?limit=1000")
    rendered = render(live)
    assert rendered =~ ~r/:process_live_test_high_memory.*:process_live_test_low_memory/s
    assert rendered =~ processes_href(1000, "", :memory, :asc)
    refute rendered =~ processes_href(1000, "", :memory, :desc)

    rendered = render_patch(live, "/dashboard/processes?limit=1000&sort_dir=asc")
    assert rendered =~ ~r/:process_live_test_low_memory.*:process_live_test_high_memory/s
    assert rendered =~ processes_href(1000, "", :memory, :desc)
    refute rendered =~ processes_href(1000, "", :memory, :asc)
  end

  test "order processes by reductions" do
    Agent.start_link(fn -> List.duplicate("a", 1) end, name: :process_live_test_low_reductions)

    Agent.start_link(fn -> List.duplicate("a", 1000) end,
      name: :process_live_test_high_reductions
    )

    {:ok, live, _} = live(build_conn(), processes_path(1000, "", :reductions_diff, :desc))
    rendered = render(live)
    assert rendered =~ ~r/:process_live_test_high_reductions.*:process_live_test_low_reductions/s
    assert rendered =~ processes_href(1000, "", :reductions_diff, :asc)
    refute rendered =~ processes_href(1000, "", :reductions_diff, :desc)

    rendered = render_patch(live, processes_path(1000, "", :reductions_diff, :asc))
    assert rendered =~ ~r/:process_live_test_low_reductions.*:process_live_test_high_reductions/s
    assert rendered =~ processes_href(1000, "", :reductions_diff, :desc)
    refute rendered =~ processes_href(1000, "", :reductions_diff, :asc)
  end

  test "order processes by message queue len" do
    {:ok, pid} = Task.start_link(fn -> Process.sleep(:infinity) end)
    Process.register(pid, :process_live_test_low_msgq)
    {:ok, pid} = Task.start_link(fn -> Process.sleep(:infinity) end)
    Process.register(pid, :process_live_test_high_msgq)
    Enum.each(1..1000, &send(pid, {:msg, &1}))

    {:ok, live, _} = live(build_conn(), processes_path(1000, "", :message_queue_len, :desc))
    rendered = render(live)
    assert rendered =~ ~r/:process_live_test_high_msgq.*:process_live_test_low_msgq/s
    assert rendered =~ processes_href(1000, "", :message_queue_len, :asc)
    refute rendered =~ processes_href(1000, "", :message_queue_len, :desc)

    rendered = render_patch(live, processes_path(1000, "", :message_queue_len, :asc))
    assert rendered =~ ~r/:process_live_test_low_msgq.*:process_live_test_high_msgq/s
    assert rendered =~ processes_href(1000, "", :message_queue_len, :desc)
    refute rendered =~ processes_href(1000, "", :message_queue_len, :asc)
  end

  @kill_process_label "Kill process"

  test "shows process info modal" do
    pid = Process.whereis(Phoenix.LiveDashboard.DynamicSupervisor)

    {:ok, live, _} = live(build_conn(), process_info_path(pid, 10, :message_queue_len, :desc))
    rendered = render(live)
    assert rendered =~ processes_href(10, "", :message_queue_len, :desc)

    assert rendered =~ "modal-content"
    assert rendered =~ ~r/Registered name.*Phoenix.LiveDashboard.DynamicSupervisor/
    assert rendered =~ ~r/Initial call.*Supervisor.Default.init\/1/

    refute live |> element("#modal-close") |> render_click() =~ "modal"
    return_path = processes_path(10, "", :message_queue_len, :desc)
    assert_patch(live, return_path)
  end

  @tag :capture_log
  test "cannot kill process when disabled" do
    {:ok, pid} = Task.start_link(fn -> Process.sleep(:infinity) end)

    {:ok, live, _} = live(build_conn(), process_info_path(pid, 10, :message_queue_len, :desc))
    refute render(live) =~ @kill_process_label

    Process.flag(:trap_exit, true)
    catch_exit(render_click(live, "kill"))
  end

  test "can kill process when enabled" do
    {:ok, pid} = Task.start(fn -> Process.sleep(:infinity) end)
    ref = Process.monitor(pid)

    {:ok, live, _} =
      live(build_conn(), process_info_path("config", pid, 10, :message_queue_len, :desc))

    live |> element("button", @kill_process_label) |> render_click()
    assert_received {:DOWN, ^ref, _, _, :killed}

    return_path = processes_path("config", 10, "", :message_queue_len, :desc)
    assert_patch(live, return_path, 1000)
  end

  defp processes_href(limit, search, sort_by, sort_dir) do
    ~s|href="#{Plug.HTML.html_escape_to_iodata(processes_path(limit, search, sort_by, sort_dir))}"|
  end

  defp process_info_path(prefix \\ "dashboard", pid, limit, sort_by, sort_dir) do
    processes_path(prefix, limit, "", sort_by, sort_dir) <>
      "&info=#{Phoenix.LiveDashboard.PageBuilder.encode_pid(pid)}"
  end

  defp processes_path(prefix \\ "dashboard", limit, search, sort_by, sort_dir) do
    "/#{prefix}/processes?" <>
      "limit=#{limit}&search=#{search}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end
end
