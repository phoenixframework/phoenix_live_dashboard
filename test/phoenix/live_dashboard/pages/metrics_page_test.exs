defmodule Phoenix.LiveDashboard.MetricsPageTest do
  use ExUnit.Case, async: true

  import Phoenix.ConnTest
  import Phoenix.LiveViewTest
  @endpoint Phoenix.LiveDashboardTest.Endpoint

  test "menu_link/2" do
    assert :skip = Phoenix.LiveDashboard.MetricsPage.menu_link(%{}, %{dashboard_running?: false})

    link = "https://hexdocs.pm/phoenix_live_dashboard/metrics.html"

    assert {:disabled, "Metrics", ^link} =
             Phoenix.LiveDashboard.MetricsPage.menu_link(
               %{metrics: nil},
               %{dashboard: true}
             )

    assert {:ok, "Metrics"} =
             Phoenix.LiveDashboard.MetricsPage.menu_link(
               %{metrics: {Module, :fun}},
               %{dashboard: true}
             )
  end

  test "redirects to the first metrics group if no metric group is provided" do
    {:error, {:live_redirect, %{to: "/dashboard/metrics?nav=ecto"}}} =
      live(build_conn(), "/dashboard/metrics")
  end

  test "redirects to the first metrics group if no metric group is provided keeping node" do
    {:error, {:live_redirect, %{to: "/dashboard/nonode%40nohost/metrics?nav=ecto"}}} =
      live(build_conn(), "/dashboard/nonode@nohost/metrics")
  end

  test "shows given group metrics" do
    {:ok, live, _} = live(build_conn(), "/dashboard/metrics?nav=phx")
    rendered = render(live)
    assert rendered =~ "Updates automatically"
    assert rendered =~ "Phx"
    assert rendered =~ "Ecto"
    assert rendered =~ "MyApp"
    assert rendered =~ ~s|data-title="phx.b.c"|
    assert rendered =~ ~s|data-title="phx.b.d"|

    send(live.pid, {:telemetry, [{0, nil, "value", System.system_time(:millisecond)}]})

    # Guarantees the message above has been processed
    _ = render(live)

    # Guarantees the components have been updated
    assert render(live) =~ ~s|<span data-x="C" data-y="value"|
  end

  test "redirects on unknown group" do
    {:error, {:live_redirect, %{to: "/dashboard/metrics?nav=ecto"}}} =
      live(build_conn(), "/dashboard/metrics?nav=unknown")
  end

  test "redirects on unknown group keeping node" do
    {:error, {:live_redirect, %{to: "/dashboard/nonode%40nohost/metrics?nav=ecto"}}} =
      live(build_conn(), "/dashboard/nonode@nohost/metrics?nav=unknown")
  end

  test "renders history for metrics" do
    data1 = ~s|<span data-x="#{TestHistory.label1()}" data-y="#{TestHistory.measurement1()}"|
    data2 = ~s|<span data-x="#{TestHistory.label2()}" data-y="#{TestHistory.measurement2()}"|

    {:ok, live, _} = live(build_conn(), "/dashboard/metrics?nav=phx")
    refute render(live) =~ data1
    refute render(live) =~ data2

    {:ok, live, _} = live(build_conn(), "/config/nonode@nohost/metrics?nav=phx")
    assert render(live) =~ data1
    assert render(live) =~ data2
  end

  describe "assigns_from_metric" do
    import Telemetry.Metrics

    defp subject(metric), do: Phoenix.LiveDashboard.MetricsPage.assigns_from_metric("123", metric)

    test "counter metric" do
      assert %{
               label: "Duration",
               kind: :counter,
               title: "a.b.c.duration",
               bucket_size: nil
             } = subject(counter([:a, :b, :c, :duration]))
    end

    test "summary metric" do
      assert %{
               label: "Count",
               kind: :summary,
               title: "a.b.c.count",
               bucket_size: nil
             } = subject(summary([:a, :b, :c, :count]))
    end

    test "last_value metric" do
      assert %{
               label: "Count",
               kind: :last_value,
               title: "a.b.c.count",
               bucket_size: nil
             } = subject(last_value([:a, :b, :c, :count]))
    end

    test "distribution metric" do
      assert %{
               label: "Count",
               kind: :distribution,
               title: "a.b.c.count",
               bucket_size: 20
             } = subject(distribution([:a, :b, :c, :count]))
    end

    test "adds tags to title" do
      assert %{
               title: "a.b.c.count (foo-bar)",
               tags: [:foo, :bar]
             } = subject(last_value([:a, :b, :c, :count], tags: [:foo, :bar]))
    end

    test "transforms unit" do
      assert %{unit: "MB"} = subject(last_value([:a, :b, :c, :size], unit: :megabyte))
      assert %{unit: "whatever"} = subject(last_value([:a, :b, :c, :size], unit: :whatever))
    end

    test "adds hint from description" do
      description = "test description"

      assert %{hint: ^description} =
               subject(last_value([:a, :b, :c, :size], description: description))
    end

    test "adds prune_threshold from report_options" do
      opts = [reporter_options: [prune_threshold: 5]]
      assert %{prune_threshold: 5} = subject(last_value([:a, :b, :c, :size], opts))
    end

    test "adds refresh_interval from report_options" do
      opts = [reporter_options: [refresh_interval: 5]]
      assert %{refresh_interval: 5} = subject(last_value([:a, :b, :c, :size], opts))
    end
  end
end
