defmodule Phoenix.LiveDashboard.Pages.MemoryAllocatorsPageTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "menu_link/2" do
    assert {:ok, "Memory Allocators"} =
             Phoenix.LiveDashboard.MemoryAllocatorsPage.menu_link(nil, nil)
  end

  test "renders the graph" do
    {:ok, live, _} = live(build_conn(), path())
    graph = live |> element("#chart-memory-allocators-chart") |> render()

    assert graph =~ ~s|data-title="Memory Allocators"|
    assert graph =~ ~s|data-metric="last_value"|
    assert graph =~ ~s|data-unit="KB"|
    assert graph =~ ~s|data-prune-threshold="1000"|
  end

  test "renders the table" do
    {:ok, live, _} = live(build_conn(), path())
    table = live |> element("#memory-allocators-table") |> render()

    assert table =~ ~r|<h5 class="card-title">[\r\n\s]*Memory Allocators[\r\n\s]*</h5>|
    assert table =~ "0 B"
    assert table =~ "KB"
    assert table =~ "MB"

    ~w(total temp_alloc sl_alloc std_alloc ll_alloc eheap_alloc ets_alloc fix_alloc literal_alloc binary_alloc driver_alloc)
    |> Enum.each(fn name -> assert table =~ render_row(name) end)
  end

  test "sortable" do
    {:ok, live, _} = live(build_conn(), path(:max_carrier_size, :desc))

    assert live
           |> element("th.memory-allocators-table-max_carrier_size")
           |> render() =~ ~s|<span class="icon-sort icon-desc"></span>|

    render_patch(live, path(:carrier_size, :asc))

    assert live
           |> element("th.memory-allocators-table-carrier_size")
           |> render() =~ ~s|<span class="icon-sort icon-asc"></span>|

    render_patch(live, path(:block_size, :asc))

    assert live
           |> element("th.memory-allocators-table-block_size")
           |> render() =~ ~s|<span class="icon-sort icon-asc"></span>|
  end

  defp render_row(name) do
    ~r|<td class="memory-allocators-table-name">[\r\n\s]*#{name}[\r\n\s]*</td>|
  end

  defp path(sort_by \\ :block_size, sort_dir \\ :desc) do
    "/dashboard/memory_allocators?sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end
end
