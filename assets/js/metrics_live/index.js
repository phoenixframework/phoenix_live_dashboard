import { ColorWheel, LineColor } from './color_wheel'
import _css from 'uplot/dist/uPlot.min.css'
import uPlot from 'uplot'

const SeriesValue = (options) => {
  if (!options.unit) return {}

  return {
    value: (u, v) => v == null ? '--' : v.toFixed(3) + ` ${options.unit}`
  }
}

const XSeriesValue = (options) => {
  return {
    value: '{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}'
  }
}

const YAxisValue = (options) => {
  if (!options.unit) return {}

  return {
    values: (u, vals, space) => vals.map(v => +v.toFixed(2) + ` ${options.unit}`)
  }
}

const XAxis = (_options) => {
  return {
    space: 55,
    values: [
      [3600 * 24 * 365, "{YYYY}", 7, "{YYYY}"],
      [3600 * 24 * 28, "{MMM}", 7, "{MMM}\n{YYYY}"],
      [3600 * 24, "{MM}-{DD}", 7, "{MM}-{DD}\n{YYYY}"],
      [3600, "{HH}:{mm}", 4, "{HH}:{mm}\n{YYYY}-{MM}-{DD}"],
      [60, "{HH}:{mm}", 4, "{HH}:{mm}\n{YYYY}-{MM}-{DD}"],
      [1, "{ss}", 2, "{HH}:{mm}:{ss}\n{YYYY}-{MM}-{DD}"],
    ]
  }
}

const YAxis = (options) => {
  return {
    show: true,
    size: 70,
    space: 15,
    ...YAxisValue(options)
  }
}

const minChartSize = {
  width: 100,
  height: 300
}

// Limits how often a funtion is invoked
function throttle(cb, limit) {
  let wait = false;

  return () => {
    if (!wait) {
      requestAnimationFrame(cb);
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
    }
  }
}

export const newSeriesConfig = (options, index = 0) => {
  return {
    ...LineColor.at(index),
    ...SeriesValue(options),
    label: options.label,
    spanGaps: true
  }
}

/** Telemetry Metrics **/

// Maps an ordered list of dataset objects into an ordered list of data points.
const dataForDatasets = (datasets) => datasets.slice(0).map(({ data }) => data)

// Handler for an untagged CommonMetric
function nextValueForCallback({ y, z }, callback) {
  this.datasets[0].data.push(z)
  let currentValue = this.datasets[1].data[this.datasets[1].data.length - 1] || 0
  let nextValue = callback.call(this, y, currentValue)
  this.datasets[1].data.push(nextValue)
}

const findLastNonNullValue = (data) => data.reduceRight((a, c) => (c != null && a == null ? c : a), null)

// Handler for a tagged CommonMetric
function nextTaggedValueForCallback({ x, y, z }, callback) {
  // Find or create the series from the tag
  let seriesIndex = this.datasets.findIndex(({ key }) => x === key)
  if (seriesIndex === -1) {
    seriesIndex = this.datasets.push({ key: x, data: Array(this.datasets[0].data.length).fill(null) }) - 1
    this.chart.addSeries(newSeriesConfig({ label: x, unit: this.options.unit }, seriesIndex - 1), seriesIndex)
  }

  // Add the new timestamp + value, keeping datasets aligned
  this.datasets = this.datasets.map((dataset, index) => {
    if (index === 0) {
      dataset.data.push(z)
    } else if (index === seriesIndex) {
      dataset.data.push(callback.call(this, y, findLastNonNullValue(dataset.data) || 0))
    } else {
      dataset.data.push(null)
    }
    return dataset
  })
}

const tzDate = (ts) => new Date(ts)

// Handles the basic metrics like Counter, LastValue, and Sum.
class CommonMetric {
  static __projections() {
    return {
      counter: (y, value) => value + 1,
      last_value: (y) => y,
      sum: (y, value) => value + y
    }
  }

  static getConfig(options) {
    return {
      class: options.kind,
      title: options.title,
      width: options.width,
      height: options.height,
      tzDate: tzDate,
      series: [
        { ...XSeriesValue() },
        newSeriesConfig(options, 0)
      ],
      scales: {
        x: {
          min: options.now - 60,
          max: options.now
        },
        y: {
          min: 0,
          max: 1
        },
      },
      axes: [
        XAxis(),
        YAxis(options)
      ]
    }
  }

  static initialData() {
    return [[], []]
  }

  constructor(chart, options) {
    this.__callback = this.constructor.__projections()[options.metric]
    this.chart = chart
    this.datasets = [{ key: "|x|", data: [] }]
    this.options = options

    if (options.tagged) {
      this.chart.delSeries(1)
      this.__handler = nextTaggedValueForCallback
    } else {
      this.datasets.push({ key: options.label, data: [] })
      this.__handler = nextValueForCallback
    }
  }

  handleMeasurements(measurements) {
    measurements.forEach((measurement) => this.__handler.call(this, measurement, this.__callback))
    this.chart.setData(dataForDatasets(this.datasets))
  }
}

// Displays a measurement summary
class Summary {
  constructor(chart, options) {
    // TODO: Get percentiles from options
    this.chart = chart
    this.datasets = this.constructor.initialData()
    this.options = options
    this.min = null
    this.max = null
    this.total = 0
    this.count = 0
  }

  handleMeasurements(data) {
    data.forEach(({ x, y, z }) => {
      // Increment the new totals
      this.count++
      this.total += y

      // Push the static values
      this.datasets[0].push(z)
      this.datasets[1].push(y)

      // Push min/max/avg
      if (this.min === null || y < this.min) { this.min = y }
      this.datasets[2].push(this.min)

      if (this.max === null || y > this.max) { this.max = y }
      this.datasets[3].push(this.max)

      this.datasets[4].push(this.total / this.count)
    })

    this.chart.setData(this.datasets)
  }

  static initialData() { return [[], [], [], [], []] }

  static getConfig(options) {
    return {
      class: options.kind,
      title: options.title,
      width: options.width,
      height: options.height,
      tzDate: tzDate,
      series: [
        { ...XSeriesValue() },
        newSeriesConfig(options, 0),
        {
          label: "Min",
          fill: "rgba(0, 0, 0, .07)",
          band: true,
          width: 0,
          show: false,
          ...SeriesValue(options)
        },
        {
          label: "Max",
          fill: "rgba(0, 0, 0, .07)",
          band: true,
          width: 0,
          show: false,
          ...SeriesValue(options)
        },
        {
          label: "Avg",
          fill: "rgba(0, 0, 0, .07)",
          stroke: "red",
          dash: [10, 10],
          ...SeriesValue(options)
        },
      ],
      scales: {
        x: {
          min: options.now - 60,
          max: options.now
        },
        y: {
          min: 0,
          max: 1
        },
      },
      axes: [
        XAxis(),
        YAxis(options)
      ]
    }
  }
}

const __METRICS__ = {
  counter: CommonMetric,
  last_value: CommonMetric,
  sum: CommonMetric,
  summary: Summary
}

export class TelemetryChart {
  constructor(chartEl, options) {
    if (!options.metric) {
      throw new TypeError(`No metric type was provided`)
    } else if (options.metric && !__METRICS__[options.metric]) {
      throw new TypeError(`No metric defined for type ${options.metric}`)
    }

    const metric = __METRICS__[options.metric]
    this.uplotChart = new uPlot(metric.getConfig(options), metric.initialData(options), chartEl)
    this.metric = new metric(this.uplotChart, options)
  }

  resize(boundingBox) {
    this.uplotChart.setSize({
      width: Math.max(boundingBox.width, minChartSize.width),
      height: minChartSize.height
    })
  }

  pushData(measurements) {
    if (!measurements.length) return
    this.metric.handleMeasurements(measurements)
  }
}

/** LiveView Hook **/

const PhxChartComponent = {
  mounted() {
    let chartEl = this.el.parentElement.querySelector('.chart')
    let size = chartEl.getBoundingClientRect()
    let options = Object.assign({}, chartEl.dataset, {
      tagged: (chartEl.dataset.tags && chartEl.dataset.tags !== "") || false,
      width: Math.max(size.width, minChartSize.width),
      height: minChartSize.height,
      now: (new Date()).getTime()
    })

    this.chart = new TelemetryChart(chartEl, options)

    window.addEventListener("resize", throttle(() => {
      let newSize = chartEl.getBoundingClientRect()
      this.chart.resize(newSize)
    }))
  },
  updated() {
    const data = Array
      .from(this.el.children || [])
      .map(({ dataset: { x, y, z } }) => {
        return { x, y: +y, z: +z / 1e3 }
      })

    if (data.length > 0) {
      this.chart.pushData(data)
    }
  }
}

export default PhxChartComponent
