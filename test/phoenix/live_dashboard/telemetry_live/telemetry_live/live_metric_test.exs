defmodule Phoenix.LiveDashboard.LiveMetricTest do
  use ExUnit.Case, async: true
  import Phoenix.LiveViewTest
  import Telemetry.Metrics
  alias Phoenix.LiveDashboard.MetricConversion
  alias Phoenix.LiveDashboard.LiveMetric
  alias Phoenix.LiveDashboardTest.Endpoint

  @endpoint Endpoint

  describe "rendering" do
    setup _ do
      %{chart: MetricConversion.to_chart(counter([:a, :b, :c, :duration]))}
    end

    test "initial chart", %{chart: chart} do
      assert render_component(LiveMetric, id: chart.id, chart: chart) ==
               ~s|\
<div id="a-b-c-duration-counter" class="phx-dashboard-col">
  <div phx-hook="PhxLiveMetric" id="a-b-c-duration-counter--datasets" style="display:none;">\n  \n  </div>
  <div class="chart" phx-update="ignore">
    <canvas id="a-b-c-duration-counter--canvas"
     data-label="Duration"
     data-metric="counter"
     data-title="a-b-c-duration-counter"></canvas>
  </div>
</div>
|
    end
  end
end
