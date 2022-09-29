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
  mockAddSeries.mockClear()
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

  test('Summary', () => {
    const chart = new TelemetryChart(document.body, { metric: 'summary', tagged: false, label: "Duration" })

    expect(chart.metric.datasets).toEqual([
      { key: "|x|", data: [], derived: {from: -1, mode: "", dataRaw: []}},
      {
        key: "Duration",
        data: [],
        derived: {
          from: -1,
          mode: "",
          dataRaw: []
        },
        agg: {
          avg: [],
          min: [],
          max: [],
          count: 0,
          total: 0
        },
        last: {
          max: null,
          min: null
        }
      }
    ])

    chart.pushData([{ x: 'a', y: 2, z: 1 }])

    expect(mockSetData).toHaveBeenCalledWith([
      [1],
      [2]
    ])

    expect(chart.metric.datasets).toEqual([
      {
        key: "|x|",
        data: [1],
        derived: {
          from: -1,
          mode: "",
          dataRaw: []
        }
      },
      {
        key: "Duration",
        data: [2],
        derived: {
          from: -1,
          mode: "",
          dataRaw: []
        },
        agg: {
          avg: [2],
          min: [2],
          max: [2],
          count: 1,
          total: 2
        },
        last: {
          max: 2,
          min: 2
        }
      }
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

    expect(chart.metric.datasets).toEqual([
      {
        key: "|x|",
        data: [1, 3, 5, 7],
        derived: {
          from: -1,
          mode: "",
          dataRaw: []
        }
      },
      {
        key: "Duration",
        data: [2, 4, 6, 8],
        derived: {
          from: -1,
          mode: "",
          dataRaw: []
        },
        agg: {
          avg: [2, 3, 4, 5],
          min: [2, 2, 2, 2],
          max: [2, 4, 6, 8],
          count: 4,
          total: 20
        },
        last: {
          max: 8,
          min: 2
        }
      }
    ])
  })

  test('Summary (derived)', () => {
    const chart = new TelemetryChart(document.body, { metric: 'summary', tagged: false, label: "Duration", deriveModes:"mean"
   })

    expect(chart.metric.datasets).toEqual([
      { key: "|x|", data: [], derived: {from: -1, mode: "", dataRaw: []}},
      {
        key: "Duration",
        data: [],
        derived: {
          from: -1,
          mode: "",
          dataRaw: []
        },
        agg: {
          avg: [],
          min: [],
          max: [],
          count: 0,
          total: 0
        },
        last: {
          max: null,
          min: null
        }
      },
      {
        key: "Duration-mean",
        data: [],
        derived: {
          from: 1,
          mode: "mean",
          dataRaw: []
        },
        agg: {
          avg: [],
          min: [],
          max: [],
          count: 0,
          total: 0
        },
        last: {
          max: null,
          min: null
        }
      }
    ])

    chart.pushData([{ x: 'a', y: 2, z: 1 }])

    expect(mockSetData).toHaveBeenCalledWith([
      [1],
      [2],
      [2]
    ])

    expect(chart.metric.datasets).toEqual([
      {
        key: "|x|",
        data: [1],
        derived: {
          from: -1,
          mode: "",
          dataRaw: []
        }
      },
      {
        key: "Duration",
        data: [2],
        derived: {
          from: -1,
          mode: "",
          dataRaw: []
        },
        agg: {
          avg: [2],
          min: [2],
          max: [2],
          count: 1,
          total: 2
        },
        last: {
          max: 2,
          min: 2
        }
      },
      {
        key: "Duration-mean",
        data: [2],
        derived: {
          from: 1,
          mode: "mean",
          dataRaw: [{ x: 'a', y: 2, z: 1}]
        },
        agg: {
          avg: [2],
          min: [2],
          max: [2],
          count: 1,
          total: 2
        },
        last: {
          max: 2,
          min: 2
        }
      }
    ])
  })

  test('pruneThreshold prunes datasets by half', () => {
    const chart = new TelemetryChart(document.body, { metric: 'last_value', tagged: false, pruneThreshold: 4 })

    // Fill the chart
    chart.pushData([
      { x: 'a', y: 1, z: 1 },
      { x: 'a', y: 3, z: 2 },
      { x: 'a', y: 5, z: 3 },
      { x: 'a', y: 7, z: 4 },
    ])

    expect(mockSetData).toHaveBeenCalledWith([
      [1, 2, 3, 4],
      [1, 3, 5, 7],
    ])

    // Overflow the event limit
    chart.pushData([
      { x: 'a', y: 9, z: 5 }
    ])

    expect(mockSetData).toHaveBeenCalledWith([
      [2, 3, 4, 5],
      [3, 5, 7, 9]
    ])
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

  describe("Summary", () => {
    test('deletes initial dataset', () => {
      const chart = new TelemetryChart(document.body, { metric: 'summary', tagged: true })
      expect(mockDelSeries).toHaveBeenCalledWith(1)
    })

    test("aligns data and aggregations by tag", () => {
      const chart = new TelemetryChart(document.body, { metric: "summary", tagged: true })
      expect(mockDelSeries).toHaveBeenCalledTimes(1)

      chart.pushData([{ x: "a", y: 2, z: 1 }])

      expect(mockSetData).toHaveBeenCalledWith([
        [1],
        [2],
      ])

      expect(chart.metric.datasets).toEqual([
        {
          key: "|x|",
          data: [1],
          derived: {
            from: -1,
            mode: "",
            dataRaw: []
          }
        },
        {
          key: "a",
          data: [2],
          derived: {
            from: -1,
            mode: "",
            dataRaw: []
          },
          agg: {
            avg: [2],
            min: [2],
            max: [2],
            count: 1,
            total: 2
          },
          last: {
            max: 2,
            min: 2
          }
        }
      ])

      chart.pushData([{ x: "b", y: 4, z: 3 }])

      expect(mockSetData).toHaveBeenCalledWith([
        [1, 3],
        [2, null],
        [null, 4]
      ])

      expect(chart.metric.datasets).toEqual([
        {
          key: "|x|",
          data: [1, 3],
          derived: {
            from: -1,
            mode: "",
            dataRaw: []
          }
        },
        {
          key: "a",
          data: [2, null],
          derived: {
            from: -1,
            mode: "",
            dataRaw: []
          },
          agg: {
            avg: [2, null],
            min: [2, null],
            max: [2, null],
            count: 1,
            total: 2
          },
          last: {
            max: 2,
            min: 2
          }
        },
        {
          key: "b",
          data: [null, 4],
          derived: {
            from: -1,
            mode: "",
            dataRaw: []
          },
          agg: {
            avg: [null, 4],
            min: [null, 4],
            max: [null, 4],
            count: 1,
            total: 4
          },
          last: {
            max: 4,
            min: 4
          }
        }
      ])

      chart.pushData([
        { x: 'c', y: 6, z: 5 },
        { x: 'a', y: 2, z: 7 }
      ])

      expect(mockSetData).toHaveBeenCalledWith([
        [1, 3, 5, 7],
        [2, null, null, 2],
        [null, 4, null, null],
        [null, null, 6, null]
      ])
    })

    test('when dataset > pruneThreshold, prunes data to length of pruneThreshold', () => {
      const chart = new TelemetryChart(document.body, { metric: 'summary', tagged: true, pruneThreshold: 6 })

      // Fill the chart
      chart.pushData([
        { x: "a", y: -6, z: 1 },
        { x: "b", y: -4, z: 2 },
        { x: "a", y: -2, z: 3 },
        { x: "b", y: 0, z: 4 },
        { x: "a", y: 2, z: 5 },
        { x: "b", y: 4, z: 6 }
      ])

      expect(mockSetData).toHaveBeenCalledWith([
        [1, 2, 3, 4, 5, 6],
        [-6, null, -2, null, 2, null],
        [null, -4, null, 0, null, 4]
      ])

      expect(chart.metric.datasets).toEqual([
        {
          key: "|x|",
          data: [1, 2, 3, 4, 5, 6],
          derived: {
            from: -1,
            mode: "",
            dataRaw: []
          }
        },
        {
          key: "a",
          data: [-6, null, -2, null, 2, null],
          derived: {
            from: -1,
            mode: "",
            dataRaw: []
          },
          agg: {
            avg: [-6, null, -4, null, -2, null],
            min: [-6, null, -6, null, -6, null],
            max: [-6, null, -2, null, 2, null],
            count: 3,
            total: -6
          },
          last: {
            max: 2,
            min: -6
          }
        },
        {
          key: "b",
          data: [null, -4, null, 0, null, 4],
          derived: {
            from: -1,
            mode: "",
            dataRaw: []
          },
          agg: {
            avg: [null, -4, null, -2, null, 0],
            min: [null, -4, null, -4, null, -4],
            max: [null, -4, null, 0, null, 4],
            count: 3,
            total: 0
          },
          last: {
            max: 4,
            min: -4
          }
        }
      ])

      // Overflow the event limit
      chart.pushData([
        { x: "a", y: 6, z: 7 }
      ])

      expect(mockSetData).toHaveBeenCalledWith([
        [2, 3, 4, 5, 6, 7],
        [null, -2, null, 2, null, 6],
        [-4, null, 0, null, 4, null]
      ])
    })

    describe("Derived series", () => {
      test("adds series", () => {
        const chart = new TelemetryChart(document.body, { metric: "summary", tagged: true, deriveModes: "mean~p90"
       })
        expect(mockDelSeries).toHaveBeenCalledTimes(1)

        chart.pushData([{ x: "a", y: 2, z: 1 }])

        expect(mockSetData).toHaveBeenCalledWith([
          [1],
          [2],
          [2],
          [2],
        ])

        expect(chart.metric.datasets).toEqual([
        {
            key: "|x|",
            data: [1],
            derived: {
              from: -1,
              mode: "",
              dataRaw: []
            }
          },
          {
            key: "a",
            data: [2],
            derived: {
              from: -1,
              mode: "",
              dataRaw: []
            },
            agg: {
              avg: [2],
              min: [2],
              max: [2],
              count: 1,
              total: 2
            },
            last: {
              max: 2,
              min: 2
            }
          },
          {
            key: "a-mean",
            data: [2],
            derived: {
              from: 1,
              mode: "mean",
              dataRaw: [{ x: "a", y: 2, z: 1 }]
            },
            agg: {
              avg: [2],
              min: [2],
              max: [2],
              count: 1,
              total: 2
            },
            last: {
              max: 2,
              min: 2
            }
          },
          {
            key: "a-p90",
            data: [2],
            derived: {
              from: 1,
              mode: "p90",
              dataRaw: [{ x: "a", y: 2, z: 1 }]
            },
            agg: {
              avg: [2],
              min: [2],
              max: [2],
              count: 1,
              total: 2
            },
            last: {
              max: 2,
              min: 2
            }
          }
        ])
      })

      test("aligns derived series by tag", () => {
        const chart = new TelemetryChart(document.body, { metric: "summary", tagged: true, deriveModes: "mean"
        })
        expect(mockDelSeries).toHaveBeenCalledTimes(1)

        chart.pushData([{ x: "a", y: 2, z: 1 }])

        expect(mockSetData).toHaveBeenCalledWith([
          [1],
          [2],
          [2],
        ])

        expect(chart.metric.datasets).toEqual([
          {
            key: "|x|",
            data: [1],
            derived: {
              from: -1,
              mode: "",
              dataRaw: []
            }
          },
          {
            key: "a",
            data: [2],
            derived: {
              from: -1,
              mode: "",
              dataRaw: []
            },
            agg: {
              avg: [2],
              min: [2],
              max: [2],
              count: 1,
              total: 2
            },
            last: {
              max: 2,
              min: 2
            }
          },
          {
            key: "a-mean",
            data: [2],
            derived: {
              from: 1,
              mode: "mean",
              dataRaw: [{ x: "a", y: 2, z: 1 }]
            },
            agg: {
              avg: [2],
              min: [2],
              max: [2],
              count: 1,
              total: 2
            },
            last: {
              max: 2,
              min: 2
            }
          }
        ])

        chart.pushData([{ x: "b", y: 4, z: 3 }])

        expect(mockSetData).toHaveBeenCalledWith([
          [1, 3],
          [2, null],
          [2, null],
          [null, 4],
          [null, 4]
        ])

        expect(chart.metric.datasets).toEqual([
          {
            key: "|x|",
            data: [1, 3],
            derived: {
              from: -1,
              mode: "",
              dataRaw: []
            }
          },
          {
            key: "a", //will have id 1
            data: [2, null],
            derived: {
              from: -1,
              mode: "",
              dataRaw: []
            },
            agg: {
              avg: [2, null],
              min: [2, null],
              max: [2, null],
              count: 1,
              total: 2
            },
            last: {
              max: 2,
              min: 2
            }
          },
          {
            key: "a-mean", //will have id 2
            data: [2, null],
            derived: {
              from: 1, //a will be 1
              mode: "mean",
              dataRaw: [{ x: "a", y: 2, z: 1 }, null]
            },
            agg: {
              avg: [2, null],
              min: [2, null],
              max: [2, null],
              count: 1,
              total: 2
            },
            last: {
              max: 2,
              min: 2
            }
          },
          {
            key: "b", //will have id 3
            data: [null, 4],
            derived: {
              from: -1,
              mode: "",
              dataRaw: []
            },
            agg: {
              avg: [null, 4],
              min: [null, 4],
              max: [null, 4],
              count: 1,
              total: 4
            },
            last: {
              max: 4,
              min: 4
            }
          },
          {
            key: "b-mean",
            data: [null, 4],
            derived: {
              from: 3,
              mode: "mean",
              dataRaw: [null, { x: "b", y: 4, z: 3 }]
            },
            agg: {
              avg: [null, 4],
              min: [null, 4],
              max: [null, 4],
              count: 1,
              total: 4
            },
            last: {
              max: 4,
              min: 4
            }
          }
        ])

        chart.pushData([
          { x: 'c', y: 6, z: 5 },
          { x: 'a', y: 2, z: 7 }
        ])

        expect(mockSetData).toHaveBeenCalledWith([
          [1, 3, 5, 7],
          [2, null, null, 2],
          [2, null, null, 2],
          [null, 4, null, null],
          [null, 4, null, null],
          [null, null, 6, null],
          [null, null, 6, null]
        ])
      })

      test("mean numerics", () => {
        const chart = new TelemetryChart(document.body, { metric: "summary", tagged: true, deriveModes: "mean"
        })
        expect(mockDelSeries).toHaveBeenCalledTimes(1)

        chart.pushData([
          { x: "a", y: 2, z: 1 },
          { x: "a", y: 3, z: 2 },
          { x: "a", y: 4, z: 3 },
          { x: "a", y: 5, z: 4 },
          { x: "a", y: 6, z: 5 },
          { x: "a", y: -10, z: 6 },
        ])

        expect(mockSetData).toHaveBeenCalledWith([
          [1,2,3,4,5,6],
          [2,3,4,5,6,-10],
          [2,2.5,3,3.5,4,10/6]
        ])
      })

      test("percentile numerics", () => {
        const chart = new TelemetryChart(document.body, { metric: "summary", tagged: true, deriveModes: "p50~p90~p0~p100"
        })
        expect(mockDelSeries).toHaveBeenCalledTimes(1)


        chart.pushData([
          { x: "a", y: 2, z: 1 },
          { x: "a", y: 4, z: 2 },
          { x: "a", y: 3, z: 3 },
          { x: "a", y: 3, z: 4 },
          { x: "a", y: 4, z: 5 },
          { x: "a", y: -7, z: 6 },
        ])

        expect(mockSetData).toHaveBeenCalledWith([
          [1,2,3,4,5,6],
          [2,4,3,3,4,-7],
          [2,2,3,3,3,3], // 50th percentile
          [2,2,3,3,4,4], // 90th percentile
          [2,2,2,2,2,-7], // 0th percentile
          [2,4,4,4,4,4], // 100th percentile
        ])
      })

      test("windowing timer filters old points", () => {
        const chart = new TelemetryChart(document.body, { metric: "summary", tagged: true, deriveModes: "mean", deriveWindowSecs: 2})
        expect(mockDelSeries).toHaveBeenCalledTimes(1)

        chart.pushData([
          { x: "a", y: 2, z: 1 },
          { x: "a", y: 4, z: 2 },
          { x: "a", y: 3, z: 3 },
          { x: "a", y: 12, z: 8 },
          { x: "a", y: 4, z: 10 },
          { x: "a", y: -7, z: 22 },
          { x: "a", y: 9, z: 24.1 },
        ])

        expect(mockSetData).toHaveBeenCalledWith([
          [1,2,3,8,10,22,24.1],
          [2,4,3,12,4,-7,9],
          [2,3,3,12,8,-7,9], // mean of last 2 sec
        ])
      })

      test("filters nulls", () => {
        const chart = new TelemetryChart(document.body, { metric: "summary", tagged: true, deriveModes: "mean",
        deriveWindowSecs: 2})
        expect(mockDelSeries).toHaveBeenCalledTimes(1)

        chart.pushData([
          { x: "a", y: 2, z: 1 },
          { x: "a", y: 4, z: 2 },
          { x: "b", y: 3, z: 3 },
          { x: "a", y: 12, z: 4 },
          { x: "a", y: 4, z: 10 },
          { x: "a", y: -7, z: 22 },
          { x: "a", y: 9, z: 24.1 },
        ])

        expect(mockSetData).toHaveBeenCalledWith([
          [1,2,3,4,10,22,24.1],
          [2,4,null,12,4,-7,9], // a
          [2,3,null,8,4,-7,9], // a: mean of last 2 sec
          [null,null,3,null,null,null,null], // b
          [null,null,3,null,null,null,null] // b: mean of last 2 sec
        ])
      })

      test("is pruned", () => {
        const chart = new TelemetryChart(document.body, { metric: "summary", tagged: true, deriveModes: "mean",
         deriveWindowSecs: 1000, pruneThreshold: 2})
        expect(mockDelSeries).toHaveBeenCalledTimes(1)

        const dataToPush = [
          { x: "a", y: 2, z: 1 },
          { x: "a", y: 3, z: 2 },
          { x: "a", y: 4, z: 3 },
          { x: "a", y: 5, z: 4 },
          { x: "a", y: 6, z: 5 },
          { x: "a", y: 7, z: 6 },
        ]
        
        //so that prune is called after each push
        dataToPush.forEach(
          d => {
            chart.pushData([d])
          }
        )
        
        expect(mockSetData).toHaveBeenLastCalledWith([
          [5,6],
          [6,7], // a
          [5,6] // a: mean of last 3 items because prune happens after measurement is computed
        ])

      })

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
