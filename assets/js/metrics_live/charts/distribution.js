import uPlot from 'uplot'
import calculateStatistics from './distribution/statistics'
import boxplot from './distribution/box_plot'
import {
  LineColor
} from '../color_wheel'

class Distribution {
  constructor(options, chartEl) {
    let config = this.constructor.getConfig(options)
    this.chart = new uPlot(config, initialData(options), chartEl)
    this.pruneThreshold = options.pruneThreshold || 1000;
    this.options = options
    this.datasets = {};
  }

  handleMeasurements(measurements) {
    measurements.forEach(measurement => {
      addMeasurement(this.datasets, measurement);
    })
    maybePruneDirtyDatasets(this.datasets, this.pruneThreshold);
    maybeRecalculateStatistics(this.datasets);
    let plotData = asPlotData(this.datasets);
    this.chart.setData(plotData);
  }

  static getConfig(options) {

    return {
      class: options.kind,
      title: options.title,
      width: options.width,
      height: options.height,
      plugins: boxplot.plugins(boxPlotOptions()),
      axes: [{
        show: options.tagged,
        rotate: 90,
        space: 10,
        size: 150,
        grid: {
          show: false
        },
        values: (_, vals) => vals
      }, ],
      scales: {
        x: {
          distr: 2,
          time: false,
        }
      },
      // the series labels correspond to box lines drawn in the boxPlot plugin
      // which expects data to be at predetermined positions
      // (ie median at index=1, q1 at index = 2 etc.)
      series: [{
          label: options.tags,
          value: (_, val) => val,
        },
        {
          label: "median",
          value: seriesValueDisplay(options)
        },
        {
          label: "q1",
          value: seriesValueDisplay(options)
        },
        {
          label: "q3",
          value: seriesValueDisplay(options)
        },
        {
          label: "min",
          value: seriesValueDisplay(options)
        },
        {
          label: "max",
          value: seriesValueDisplay(options)
        },
      ],
    }
  }
}

function initialData() {
  // [x-labels, medians, q1s, q3s, mins, maxs]
  return [
    [],
    [],
    [],
    [],
    [],
    []
  ]
}

function seriesValueDisplay(options) {
  return (_, val) => {
    if (options.unit) {
      return `${val} ${options.unit}`
    }
    return val
  }
}

function boxPlotOptions() {
  let colors = {
    box: LineColor.at(0),
    col: LineColor.at(6),
    legend: LineColor.at(4)
  }

  return {
    columnHighlightPlugin: {
      style: {
        backgroundColor: colors.col.fill
      }
    },
    legendAsTooltipPlugin: {
      style: {
        backgroundColor: colors.legend.overlay
      }
    },
    boxesPlugin: {
      bodyWidthFactor: 0.7,
      style: {
        outlineColor: colors.box.stroke,
        fillColor: colors.box.fill
      }
    }
  }
}

function addMeasurement(datasets, measurement) {
  const {
    x: tag,
    y: value
  } = measurement;
  let dataset = datasets[tag] || {
    values: [],
    dirty: true
  }
  dataset.values.push(value);
  dataset.dirty = true;

  datasets[tag] = dataset;
  return datasets;
}

function maybePruneDirtyDatasets(datasets, pruneThreshold) {
  Object.keys(datasets)
    .forEach(tag => {
      let dataset = datasets[tag];
      let size = dataset.values.length
      if (size > pruneThreshold) {
        dataset.values = dataset.values.slice(size / 2)
      }
    });
}

function maybeRecalculateStatistics(datasets) {
  Object.keys(datasets)
    .forEach(tag => {
      let dataset = datasets[tag];
      // a dataset can be dirty either because 
      // new values were added and/or old values were pruned
      if (dataset.dirty) {
        dataset.stats = calculateStatistics(dataset.values);
        dataset.dirty = false;
      }
    });
}

function asPlotData(datasets) {
  return Object.keys(datasets)
    // sort by alphabetical order of tags
    .sort((tag1, tag2) => {
      return tag1.localeCompare(tag2)
    })
    .reduce((plotData, tag) => {
      let dataset = datasets[tag];

      const {
        median,
        q1,
        q3,
        min,
        max
      } = dataset.stats;

      // make sure the order is the same as the series labels
      let values = [tag, fixVal(median), fixVal(q1), fixVal(q3), fixVal(min), fixVal(max)]
      for (let i = 0; i < values.length; i++) {
        plotData[i].push(values[i]);
      }

      return plotData;
    }, initialData())
}

function fixVal(val) {
  return val && !isNaN(val) ? val.toFixed(2) : 0;
}

export default Distribution