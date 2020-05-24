defmodule Phoenix.LiveDashboard.EtsLiveTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "search" do
    :ets.new(Bar, [:bag, :protected])
    :ets.new(:foo_bar, [:set, :protected])

    {:ok, live, _} = live(build_conn(), ets_path(100, "foo", :size, :desc))
    rendered = render(live)
    assert rendered =~ "foo"
    refute rendered =~ "Bar"
    assert rendered =~ "tables out of 1"
    assert rendered =~ ets_href(100, "foo", :size, :asc)

    {:ok, live, _} = live(build_conn(), ets_path(100, ":foo_bar", :size, :desc))
    rendered = render(live)
    assert rendered =~ ~r/:foo_bar/
    assert rendered =~ "tables out of 1"
  end

  test "order tables by size" do
    :ets.new(:table_small, [:set, :protected])
    table_big_ref = :ets.new(:table_big, [:set, :protected])

    for i <- 1..1000 do
      :ets.insert(table_big_ref, {"item_#{i}"})
    end

    {:ok, live, _} = live(build_conn(), "/dashboard/nonode@nohost/ets?limit=1000")
    rendered = render(live)
    assert rendered =~ ~r/:table_big.*:table_small/
    assert rendered =~ ets_href(1000, "", :size, :asc)
    refute rendered =~ ets_href(1000, "", :size, :desc)

    rendered = render_patch(live, "/dashboard/nonode@nohost/ets?limit=1000&sort_dir=asc")
    assert rendered =~ ~r/:table_small.*:table_big/
    assert rendered =~ ets_href(1000, "", :size, :desc)
    refute rendered =~ ets_href(1000, "", :size, :asc)
  end

  test "order tables by memory" do
    :ets.new(:table_small, [:set, :protected])
    table_big_ref = :ets.new(:table_big, [:set, :protected])

    for i <- 1..10 do
      :ets.insert(table_big_ref, {"item_#{i}"})
    end

    {:ok, live, _} = live(build_conn(), ets_path(1000, "", :memory, :desc))
    rendered = render(live)

    assert rendered =~ ~r/:table_big.*:table_small/
    assert rendered =~ ets_href(1000, "", :memory, :asc)
    refute rendered =~ ets_href(1000, "", :memory, :desc)

    rendered = render_patch(live, ets_path(1000, "", :memory, :asc))
    assert rendered =~ ~r/:table_small.*:table_big/
    assert rendered =~ ets_href(1000, "", :memory, :desc)
    refute rendered =~ ets_href(1000, "", :memory, :asc)
  end

  test "shows table info modal" do
    ref = :ets.new(:table_test_ets, [:set, :public])

    {:ok, live, _} = live(build_conn(), ets_info_path(ref, 1000, :size, :desc))
    rendered = render(live)
    assert rendered =~ ets_href(1000, "", :size, :desc)

    assert rendered =~ "modal-content"
    assert rendered =~ ~r/:table_test_ets/

    refute live |> element("#modal .close") |> render_click() =~ "modal"
    return_path = ets_path(1000, "", :size, :desc)
    assert_patch(live, return_path)
  end

  defp ets_href(limit, search, sort_by, sort_dir) do
    ~s|href="#{Plug.HTML.html_escape_to_iodata(ets_path(limit, search, sort_by, sort_dir))}"|
  end

  defp ets_info_path(ref, limit, sort_by, sort_dir) do
    ets_path(limit, "", sort_by, sort_dir) <>
      "&info=#{Phoenix.LiveDashboard.LiveHelpers.encode_ets(ref)}"
  end

  defp ets_path(limit, search, sort_by, sort_dir) do
    "/dashboard/nonode%40nohost/ets?" <>
      "limit=#{limit}&search=#{search}&sort_by=#{sort_by}&sort_dir=#{sort_dir}"
  end
end
