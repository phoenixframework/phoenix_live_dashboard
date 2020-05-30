// Initialize the uPlot mocks
const mockDelSeries = jest.fn()
const mockAddSeries = jest.fn()
const mockSetData = jest.fn()

jest.mock('uplot', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return {
        series: [],
        addSeries: mockAddSeries,
        delSeries: mockDelSeries,
        setData: mockSetData
      }
    })
  }
})

import { TelemetryChart, newSeriesConfig } from '../js/metrics_live'
import uPlot from 'uplot'

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  uPlot.mockClear()
  mockDelSeries.mockClear()
  mockSetData.mockClear()
})

describe('TelemetryChart', () => {
  test('instantiates uPlot', () => {
    const chart = new TelemetryChart(document.body, { metric: 'counter', tagged: false })

    expect(uPlot).toHaveBeenCalledTimes(1)
  })

  test('raises without metric', () => {
    expect(() => {
      new TelemetryChart(document.body, {})
    }).toThrowError(new TypeError(`No metric type was provided`))
  })

  test('raises if metric is invalid', () => {
    expect(() => {
      new TelemetryChart(document.body, { metric: 'invalid' })
    }).toThrowError(new TypeError(`No metric defined for type invalid`))
  })
})

describe('Metrics no tags', () => {
  test('Counter', () => {
    const chart = new TelemetryChart(document.body, { metric: 'counter', tagged: false })

    chart.pushData([{ x: 'a', y: 2, z: 1 }])

    expect(mockSetData).toHaveBeenCalledWith([
      [1],
      [1]
    ])

    chart.pushData([{ x: 'b', y: 4, z: 3 }])

    expect(mockSetData).toHaveBeenCalledWith([
      [1, 3],
      [1, 2]
    ])

    chart.pushData([
      { x: 'c', y: 6, z: 5 },
      { x: 'd', y: 8, z: 7 }
    ])

    expect(mockSetData).toHaveBeenCalledWith([
      [1, 3, 5, 7],
      [1, 2, 3, 4]
    ])
  })

  test('LastValue', () => {
    const chart = new TelemetryChart(document.body, { metric: 'last_value', tagged: false })

    chart.pushData([{ x: 'a', y: 2, z: 1 }])

    expect(mockSetData).toHaveBeenCalledWith([
      [1],
      [2]
    ])

    chart.pushData([{ x: 'b', y: 4, z: 3 }])

    expect(mockSetData).toHaveBeenCalledWith([
      [1, 3],
      [2, 4]
    ])

    chart.pushData([
      { x: 'c', y: 6, z: 5 },
      { x: 'd', y: 8, z: 7 }
    ])

    expect(mockSetData).toHaveBeenCalledWith([
      [1, 3, 5, 7],
      [2, 4, 6, 8]
    ])
  })

  test('Sum', () => {
    const chart = new TelemetryChart(document.body, { metric: 'sum', tagged: false })

    chart.pushData([{ x: 'a', y: 2, z: 1 }])

    expect(mockSetData).toHaveBeenCalledWith([
      [1],
      [2]
    ])

    chart.pushData([{ x: 'b', y: 4, z: 3 }])

    expect(mockSetData).toHaveBeenCalledWith([
      [1, 3],
      [2, 6]
    ])

    chart.pushData([
      { x: 'c', y: 6, z: 5 },
      { x: 'd', y: 8, z: 7 }
    ])

    expect(mockSetData).toHaveBeenCalledWith([
      [1, 3, 5, 7],
      [2, 6, 12, 20]
    ])
  })

  describe('Summary', () => {
    test('initializes the chart', () => {
      const chart = new TelemetryChart(document.body, { metric: 'summary', tagged: false })
      expect(mockDelSeries).toHaveBeenCalledTimes(0)
    })

    test('initializes the tagged chart', () => {
      const chart = new TelemetryChart(document.body, { metric: 'summary', tagged: true })
      expect(mockDelSeries).toHaveBeenCalledTimes(4)
    })

    test('pushes value/min/max/avg', () => {
      const chart = new TelemetryChart(document.body, { metric: 'summary', tagged: false })
      chart.pushData([{ x: 'a', y: 2, z: 1 }])

      expect(mockSetData).toHaveBeenCalledWith([
        [1],
        [2],
        [2],
        [2],
        [2]
      ])

      chart.pushData([{ x: 'b', y: 4, z: 3 }])

      expect(mockSetData).toHaveBeenCalledWith([
        [1, 3],
        [2, 4],
        [2, 2],
        [2, 4],
        [2, 3]
      ])

      chart.pushData([
        { x: 'c', y: 6, z: 5 },
        { x: 'd', y: 8, z: 7 }
      ])

      expect(mockSetData).toHaveBeenCalledWith([
        [1, 3, 5, 7],
        [2, 4, 6, 8],
        [2, 2, 2, 2],
        [2, 4, 6, 8],
        [2, 3, 4, 5]
      ])
    })
  })
})

describe('Metrics with tags', () => {
  describe('LastValue', () => {
    test('deletes initial dataset', () => {
      const chart = new TelemetryChart(document.body, { metric: 'last_value', tagged: true })
      expect(mockDelSeries).toHaveBeenCalledWith(1)
    })

    test('aligns data by tag', () => {
      const chart = new TelemetryChart(document.body, { metric: 'last_value', tagged: true })

      chart.pushData([{ x: 'a', y: 2, z: 1 }])
      expect(mockAddSeries).toHaveBeenCalledWith(newSeriesConfig({ label: 'a' }, 0), 1)
      expect(mockSetData).toHaveBeenCalledWith([
        [1],
        [2]
      ])

      chart.pushData([{ x: 'b', y: 4, z: 3 }])
      expect(mockAddSeries).toHaveBeenCalledWith(newSeriesConfig({ label: 'b' }, 1), 2)
      expect(mockSetData).toHaveBeenCalledWith([
        [1, 3],
        [2, null],
        [null, 4]
      ])

      chart.pushData([
        { x: 'b', y: 6, z: 5 },
        { x: 'a', y: 8, z: 7 }
      ])

      expect(mockSetData).toHaveBeenCalledWith([
        [1, 3, 5, 7],
        [2, null, null, 8],
        [null, 4, 6, null]
      ])
    })
  })

  describe('Counter', () => {
    test('deletes initial dataset', () => {
      const chart = new TelemetryChart(document.body, { metric: 'counter', tagged: true })
      expect(mockDelSeries).toHaveBeenCalledWith(1)
    })

    test('aligns data by tag', () => {
      const chart = new TelemetryChart(document.body, { metric: 'counter', tagged: true })

      chart.pushData([{ x: 'a', y: 2, z: 1 }])
      expect(mockAddSeries).toHaveBeenCalledWith(newSeriesConfig({ label: 'a' }, 0), 1)
      expect(mockSetData).toHaveBeenCalledWith([
        [1],
        [1]
      ])

      chart.pushData([{ x: 'b', y: 4, z: 3 }])
      expect(mockAddSeries).toHaveBeenCalledWith(newSeriesConfig({ label: 'b' }, 1), 2)
      expect(mockSetData).toHaveBeenCalledWith([
        [1, 3],
        [1, null],
        [null, 1]
      ])

      chart.pushData([
        { x: 'b', y: 6, z: 5 },
        { x: 'a', y: 8, z: 7 }
      ])

      expect(mockSetData).toHaveBeenCalledWith([
        [1, 3, 5, 7],
        [1, null, null, 2],
        [null, 1, 2, null]
      ])
    })
  })

  describe('Sum', () => {
    test('deletes initial dataset', () => {
      const chart = new TelemetryChart(document.body, { metric: 'sum', tagged: true })
      expect(mockDelSeries).toHaveBeenCalledWith(1)
    })

    test('aligns data by tag', () => {
      const chart = new TelemetryChart(document.body, { metric: 'sum', tagged: true })

      chart.pushData([{ x: 'a', y: 2, z: 1 }])
      expect(mockAddSeries).toHaveBeenCalledWith(newSeriesConfig({ label: 'a' }, 0), 1)
      expect(mockSetData).toHaveBeenCalledWith([
        [1],
        [2]
      ])

      chart.pushData([{ x: 'b', y: 4, z: 3 }])
      expect(mockAddSeries).toHaveBeenCalledWith(newSeriesConfig({ label: 'b' }, 1), 2)
      expect(mockSetData).toHaveBeenCalledWith([
        [1, 3],
        [2, null],
        [null, 4]
      ])

      chart.pushData([
        { x: 'b', y: 6, z: 5 },
        { x: 'a', y: 8, z: 7 }
      ])

      expect(mockSetData).toHaveBeenCalledWith([
        [1, 3, 5, 7],
        [2, null, null, 10],
        [null, 4, 10, null]
      ])
    })
  })
})

describe("refresh interval", () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return jest.useFakeTimers()
  })

  test("buffers events each interval", () => {
    const chart = new TelemetryChart(document.body, {
      metric: "counter",
      tagged: false,
      refreshInterval: 2000
    })

    chart.pushData([{ x: "a", y: 2, z: 1 }])

    // At this point in time, the chart should not have been updated yet
    expect(mockSetData).not.toBeCalled()

    // Fast-forward until all timers have been executed
    jest.runOnlyPendingTimers()

    // Now our callback should have been called!
    expect(mockSetData).toBeCalled()
    expect(mockSetData).toHaveBeenCalledWith([
      [1],
      [1]
    ])
  })

  test("when buffer is empty, chart does not update", () => {
    const chart = new TelemetryChart(document.body, {
      metric: "counter",
      tagged: false,
      refreshInterval: 2000
    })

    // Fast-forward until all timers have been executed
    jest.runOnlyPendingTimers()

    // At this point in time, the chart should not have been updated yet
    expect(mockSetData).not.toBeCalled()
  })
})
