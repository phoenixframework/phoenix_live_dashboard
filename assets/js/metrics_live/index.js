import ColorWheel from './color_wheel'
import Chart from 'chart.js'

/** Chart.js Storage Adapters **/

export const DataFns = {
  increment(labelIndex, { y: measurement }) {
    this.data.datasets[0].data[labelIndex] += measurement
  },
  indexOf(label) {
    return this.data.labels.indexOf(label)
  },
  pushDataset(label, point = { y: 0 }) {
    const labelIndex = this.data.labels.push(label)
    const { y: measurement } = point
    this.data.datasets[0].data.push(measurement)
    this.data.datasets[0].backgroundColor.push(
      ColorWheel.at(this.data.labels.length)
    )
    return labelIndex - 1
  },
  pushData(labelIndex, { y: measurement }) {
    this.data.datasets[0].data[labelIndex] = measurement
  }
}

const DatasetFns = {
  increment(labelIndex, { z }) {
    let { y } = this.data.datasets[labelIndex].data[this.data.datasets[labelIndex].length - 1]
    DatasetFns.pushData.call(this, labelIndex, { y: y++, z })
  },
  indexOf(label) {
    return this.data.datasets.findIndex(d => d.label === label)
  },
  pushDataset(label, point) {
    const color = ColorWheel.at(this.data.datasets.length)
    const data = []

    if (point) {
      const { y, z: t } = point
      data.push({ t, y })
    }

    return this.data.datasets.push({
      label: label,
      data: data,
      backgroundColor: color,
      borderColor: color,
      fill: false
    })
  },
  pushData(labelIndex, { y, z: t }) {
    this.data.datasets[labelIndex].data.push({ t, y })
  }
}

/** Chart.js Configs **/

const DoughnutConfig = (options) => {
  return {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        backgroundColor: [],
        data: [],
        label: options.title
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: options.title
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      circumference: Math.PI,
      rotation: -Math.PI,
      legend: {
        position: 'bottom',
        align: 'start'
      }
    }
  }
}

const TimeseriesConfig = (options) => {
  return {
    type: 'line',
    data: { datasets: [] },
    options: {
      responsive: true,
      scales: {
        xAxes: [{
          type: 'time',
          distribution: 'series'
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: options.label
          }
        }]
      },
      elements: {
        line: {
          tension: 0
        }
      },
      title: {
        display: true,
        text: options.title
      },
      legend: {
        position: 'bottom',
        align: 'start'
      }
    }
  }
}

const HistogramConfig = (options) => {
  return {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        backgroundColor: [],
        data: [],
        label: options.title,
        barPercentage: 1.0,
        categoryPercentage: 1.0
      }]
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: options.label
          }
        }]
      },
      title: {
        display: true,
        text: options.title
      },
      legend: false
    }
  }
}

/** Chart.js Instrument **/

const __INSTRUMENTS__ = {
  doughnut: { config: DoughnutConfig, storage: DataFns },
  timeseries: { config: TimeseriesConfig, storage: DatasetFns },
  histogram: { config: HistogramConfig, storage: DataFns }
}

class Instrument {
  static create({ instrument, ...options }) {
    return new Instrument(Object.assign({}, options, __INSTRUMENTS__[instrument]))
  }

  constructor({ config: configFn, storage: storageFns, ...options }) {
    this.config = configFn.call(null, options)
    this.storageFns = storageFns
  }

  increment({ x, y, z }) {
    let labelIndex = this.indexOf(x)
    if (labelIndex === -1) {
      this.pushDataset(x, { y: 1, z })
    } else {
      this.incrementIndex(labelIndex, { x, y, z })
    }
  }

  incrementIndex(labelIndex, point) {
    this.storageFns.increment.call(this.config, labelIndex, point)
  }

  indexOf(label) {
    return this.storageFns.indexOf.call(this.config, label)
  }

  pushDataset(label, data) {
    return this.storageFns.pushDataset.call(this.config, label, data)
  }

  pushData({ x: label, ...rest }) {
    let labelIndex = this.indexOf(label)
    if (labelIndex === -1) {
      this.pushDataset(label, rest)
    } else {
      this.storageFns.pushData.call(this.config, labelIndex, rest)
    }
  }
}

/** Telemetry Metrics **/

// Displays the last measurement received
class LastValue {
  constructor(instrument, _options) {
    this.instrument = instrument
  }

  pushData(data) {
    data.forEach((item) => this.instrument.pushData(item))
  }
}

// Displays a count of each event received
class Counter {
  constructor(instrument, _options) {
    this.instrument = instrument
  }

  pushData(data) {
    data.forEach(({ x, z }) => this.instrument.increment({ x, y: 1, z }))
  }
}

// Displays the sum of the values received
class Sum {
  constructor(instrument, _options) {
    this.instrument = instrument
  }

  pushData(data) {
    data.forEach((item) => this.instrument.increment(item))
  }
}

// Displays a measurement summary
class Summary {
  constructor(instrument, _options) {
    // TODO: Get percentiles from options
    this.instrument = instrument
  }

  pushData(data) {
    data.forEach((item) => this.instrument.pushData(item))
  }
}

// Displays a histogram
class Distribution {
  constructor(instrument, options) {
    this.instrument = instrument
    this.buckets = this.__bucketsToRanges__(options.buckets).map(([min, max]) => {
      const label = min === Number.NEGATIVE_INFINITY ? `< ${max}` : `${min}`
      return {
        labelIndex: instrument.pushDataset(label),
        range: [min, max]
      }
    })
  }

  pushData(data) {
    data.forEach(({ y: value, ...rest }) => {
      const index = this.buckets.findIndex(({ range: [min, max] }) => value > min && value <= max)
      this.instrument.incrementIndex(this.buckets[index].labelIndex, { y: 1, ...rest })
    })
  }

  __bucketsToRanges__(bucketsOption) {
    if (typeof bucketsOption !== 'string') {
      return []
    }

    const buckets = bucketsOption.split(',').flatMap(value => {
      const parsed = parseInt(value)
      return isNaN(parsed) ? [] : [parsed]
    })

    return buckets.flatMap((value, k) => {
      if (k === 0) {
        return [[Number.NEGATIVE_INFINITY, value], [value, buckets[k + 1]]]
      } else if (k === buckets.length - 1) {
        return [[value, Number.POSITIVE_INFINITY]]
      } else {
        return [[value, buckets[k + 1]]]
      }
    })
  }
}

const __METRICS__ = {
  counter: Counter,
  distribution: Distribution,
  last_value: LastValue,
  sum: Sum,
  summary: Summary
}

class TelemetryChart {
  constructor(elementOrContext, { metric: metric, ...options }) {
    let instrument = Instrument.create(options)
    this.metric = new __METRICS__[metric](instrument, options)
    this.chart = new Chart(elementOrContext, instrument.config)
  }

  pushData(data) {
    // Gives the metric the opportunity to cancel the redraw.
    if (this.metric.pushData(data) !== false) {
      this.chart.update()
    }
  }
}

/** LiveView Hook **/

const PhxChartComponent = {
  mounted() {
    let canvas = this.el.parentElement.getElementsByTagName('canvas')[0]
    let options = Object.assign({}, canvas.dataset)
    switch (options.metric) {
      case 'distribution':
        options.instrument = 'histogram'
        break
      case 'summary':
        options.instrument = 'timeseries'
        break
      default:
        options.instrument = 'doughnut'
    }
    this.chart = new TelemetryChart(canvas.getContext('2d'), options)
  },
  updated() {
    const data = Array
      .from(this.el.children || [])
      .map(({ dataset: { x, y, z } }) => { return { x, y, z } })

    if (data.length > 0) {
      this.chart.pushData(data)
    }
  }
}

export default PhxChartComponent
