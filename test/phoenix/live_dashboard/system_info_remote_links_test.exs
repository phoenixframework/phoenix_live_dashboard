defmodule Phoenix.LiveDashboard.SystemInfoRemoteLinksTest do
  use ExUnit.Case, async: true

  alias Phoenix.LiveDashboard.SystemInfo

  test "application trees tolerate links to remote processes" do
    peer = start_peer()
    remote_peer = start_peer()
    remote_pid = :peer.call(remote_peer, :erlang, :spawn, [:timer, :sleep, [:infinity]])

    child = %{id: :linked_worker, start: {Agent, :start_link, [:erlang, :link, [remote_pid]]}}
    {:ok, worker} = :peer.call(peer, Supervisor, :start_child, [:kernel_safe_sup, child])

    assert {:links, links} = :peer.call(peer, Process, :info, [worker, :links])
    assert remote_pid in links

    assert {{:master, _, []}, [_ | _]} =
             :peer.call(peer, SystemInfo, :app_tree_callback, [:kernel])
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
end
