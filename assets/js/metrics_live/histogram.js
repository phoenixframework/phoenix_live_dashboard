import { LineColor } from './color_wheel'
import uPlot from 'uplot'

const histBucket = (v, offset, incr) => incrRoundDn(v - offset, incr) + offset
const histSort = (a, b) => a - b

function incrRoundDn(num, incr) {
  return Math.floor(num / incr) * incr
}

function reBin(histogram, sort) {
  let bins = [...histogram.values()]

  sort && bins.sort((a, b) => sort(a.value, b.value))

  let values = Array(bins.length)
  let counts = Array(bins.length)

  for (let i = 0; i < bins.length; i++) {
    values[i] = bins[i].value
    counts[i] = bins[i].count
  }

  return [values, counts]
}

const getBucketSize = ({ bucketSize = 20 }) => +bucketSize

export class Histogram {
  constructor(chart, options) {
    this.chart = chart
    this.datasets = new Map();
    this.options = options
    this.bucketSize = getBucketSize(options)
    this.histOffset = 0
    // todo: enable pruning for histogram?
  }

  handleMeasurements(data) {
    data.forEach(({ y }) => {
      if (y == null) { return }
      y = histBucket(y, this.histOffset, this.bucketSize)

      let entry = this.datasets.get(y)

      if (entry) {
        entry.count++
      } else {
        this.datasets.set(y, { value: y, count: 1 })
      }
    })

    this.chart.setData(reBin(this.datasets, histSort))
  }

  static initialData() { return [[], []] }

  static getConfig(options) {
    let bucketIncr = getBucketSize(options)
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