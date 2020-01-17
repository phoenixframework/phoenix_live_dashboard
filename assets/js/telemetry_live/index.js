import ColorWheel from './color_wheel'

const DoughnutChart = (canvas) => {
  let config = {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        backgroundColor: [],
        data: [],
        label: canvas.dataset.title
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: canvas.dataset.title
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

  return {
    id: canvas.id,
    chart: new Chart(canvas.getContext('2d'), config),
    config: config,
    update: function (datasets) {
      datasets.forEach((el, idx) => {
        if (this.config.data.labels.length <= idx) {
          this.config.data.labels.push(el.dataset.label)
          this.config.data.datasets[0].data.push(el.dataset.value)
          this.config.data.datasets[0].backgroundColor.push(ColorWheel.at(idx))
        } else {
          this.config.data.datasets[0].data[idx] = el.dataset.value
        }
      })

      this.chart.update()
    }
  }
}

const timeseries_dataset = (dataset, idx) => {
  const color = ColorWheel.at(idx)

  return Object.assign({
    backgroundColor: color,
    borderColor: color,
    fill: false,
  }, dataset)
}

const LineChart = (canvas) => {
  let config = {
    type: canvas.dataset.type,
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
            labelString: canvas.dataset.label
          }
        }]
      },
      title: {
        display: true,
        text: canvas.dataset.title
      },
      legend: {
        position: 'bottom',
        align: 'start'
      }
    }
  }

  return {
    id: canvas.id,
    chart: new Chart(canvas.getContext('2d'), config),
    config: config,
    update: function (datasets) {
      datasets.forEach((el, idx) => {
        let point = { x: el.dataset.x, y: el.dataset.y }

        if (this.config.data.datasets.length <= idx) {
          this.config.data.datasets.push(timeseries_dataset({
            label: el.dataset.label,
            data: [point]
          }, this.config.data.datasets.length))
        } else {
          let last_point = this.config.data.datasets[idx].data[this.config.data.datasets[idx].data.length - 1]
          if (last_point && last_point.x == point.x && last_point.y == point.y) {
            // should we ever add the _exact_ same point to a dataset?
          } else {
            this.config.data.datasets[idx].data.push(point)
          }
        }
      })

      this.chart.update()
    }
  }
}

const ChartFactoryImpl = () => {
  return {
    factories: {},
    register: function (name, obj) { this.factories[name] = obj },
    new: function (canvas) { return this.factories[canvas.dataset.type](canvas) }
  }
}

const ChartRegistryImpl = (factory) => {
  return {
    factory: factory,
    charts: {},
    add: function (metric) {
      let canvas = metric.getElementsByTagName('canvas')[0]
      this.charts[canvas.id] = this.factory.new(canvas)
    },
    update: function (metric) {
      let canvas = metric.getElementsByTagName('canvas')[0]
      this.charts[canvas.id].update(
        Array.from(metric.getElementsByClassName('dataset'))
      )
    }
  }
}

const ChartFactory = ChartFactoryImpl()
ChartFactory.register('doughnut', DoughnutChart)
ChartFactory.register('line', LineChart)

const Charts = ChartRegistryImpl(ChartFactory)

/* Hooks for Chart.js */
const PhxLiveMetric = {
  mounted() { Charts.add(this.el) },
  updated() { Charts.update(this.el) }
}

export default PhxLiveMetric
