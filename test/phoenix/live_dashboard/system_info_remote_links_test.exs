defmodule Phoenix.LiveDashboard.SystemInfoRemoteLinksTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.SystemInfo
  alias Phoenix.LiveDashboardTest.LinkedWorker

  test "application trees skip remote links and retain local linked processes" do
    peer = start_peer()
    remote_peer = start_peer()
    remote_pid = :peer.call(remote_peer, :erlang, :spawn, [:timer, :sleep, [:infinity]])

    child = %{id: LinkedWorker, start: {LinkedWorker, :start_link, [remote_pid]}}
    {:ok, worker} = :peer.call(peer, Supervisor, :start_child, [:kernel_safe_sup, child])
    local_pid = :peer.call(peer, Agent, :get, [worker, &Function.identity/1])

    assert {:links, links} = :peer.call(peer, Process, :info, [worker, :links])
    assert remote_pid in links
    assert local_pid in links

    tree = :peer.call(peer, SystemInfo, :app_tree_callback, [:kernel])
    pids = tree_pids(tree)

    assert worker in pids
    assert local_pid in pids
    refute remote_pid in pids
  end

  defp start_peer do
    {:ok, peer, _node} =
      :peer.start(%{
        name: :peer.random_name(),
        connection: :standard_io,
        args: [~c"+S", ~c"2", ~c"-pa" | :code.get_path()]
      })

    on_exit(fn -> :peer.stop(peer) end)
    {:ok, _} = :peer.call(peer, Application, :ensure_all_started, [:elixir])
    peer
  end

  defp tree_pids({{_type, pid, _label}, children}) do
    [pid | Enum.flat_map(children, &tree_pids/1)]
  end
end
