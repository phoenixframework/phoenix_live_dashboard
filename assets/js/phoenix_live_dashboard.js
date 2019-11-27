import Charts from './metric_charts'

/* The LiveView Hook for the LiveMetric component. */
const LiveMetric = {
  mounted() { Charts.add(this.el) },
  updated() { Charts.update(this.el) }
}

export { LiveMetric }
