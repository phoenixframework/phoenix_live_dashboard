import { LineColor } from './color_wheel'
import uPlot from 'uplot'

let bucketIncr = 20
let histOffset = 0

const histBucket = v => incrRoundDn(v - histOffset, bucketIncr) + histOffset

const histFilter = [null]

const histSort = (a, b) => a - b

function histogram(vals, bucket, filter, sort) {
  let hist = new Map()

  for (let i = 0; i < vals.length; i++) {
    let v = vals[i]

    if (v != null)
      v = bucket(v)

    let entry = hist.get(v)

    if (entry)
      entry.count++
    else
      hist.set(v, { value: v, count: 1 })
  }

  filter && filter.forEach(v => hist.delete(v))

  let bins = [...hist.values()]

  sort && bins.sort((a, b) => sort(a.value, b.value))

  let values = Array(bins.length)
  let counts = Array(bins.length)

  for (let i = 0; i < bins.length; i++) {
    values[i] = bins[i].value
    counts[i] = bins[i].count
  }

  return [
    values,
    counts,
  ]
}

function incrRoundDn(num, incr) {
  return Math.floor(num / incr) * incr
}

function aggAll(data, round, filter, sort) {
  let allVals = [].concat(...data[1])
  return histogram(allVals, round, filter, sort)
}

const dataForDatasets = (datasets) => datasets.slice(0).map(({ data }) => data)

export class Histogram {
  constructor(chart, options) {
    this.chart = chart
    this.datasets = [{ key: "|x|", data: [] }]
    this.options = options
    // todo: enable pruning for histogram
    // this.pruneThreshold = getPruneThreshold(options)

    this.datasets.push({ key: options.label, data: [] })
  }

  handleMeasurements(data) {
    data.forEach(({ y }) => { this.datasets[1].data.push(y) })
    this.chart.setData(aggAll(dataForDatasets(this.datasets), histBucket, histFilter, histSort))
  }

  static initialData() { return [[], []] }

  static getConfig(options) {
    let bars = uPlot.paths.bars({ align: 1, size: [1, Infinity], gap: 4 })

    return {
      title: options.title,
      width: options.width,
      height: options.height,
      scales: {
        x: {
          time: false,
          auto: false,
          dir: 1,
          range: (u) => [
            u.data[0][0],
            u.data[0][u.data[0].length - 1] + bucketIncr,
          ]
        }
      },
      axes: [
        {
          incrs: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(mult => mult * bucketIncr),
          //	space: 0,
          splits: (u, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace) => {
            let minSpace = u.axes[axisIdx]._space
            let bucketWidth = u.valToPos(u.data[0][0] + bucketIncr, 'x') - u.valToPos(u.data[0][0], 'x')

            let firstSplit = u.data[0][0]
            let lastSplit = u.data[0][u.data[0].length - 1] + bucketIncr

            let splits = []
            let skip = Math.ceil(minSpace / bucketWidth)

            for (let i = 0, s = firstSplit; s <= lastSplit; i++, s += bucketIncr)
              !(i % skip) && splits.push(s)

            return splits
          }
        }
      ],
      series: [
        {
          label: options.label,
          value: (self, rawValue) => rawValue + `-${rawValue + bucketIncr} ${options.unit}`,
        },
        {
          paths: bars,
          points: { show: false },
          ...LineColor.at(1),
          width: 2,
          label: "Events"
        },
      ],
    }
  }
}