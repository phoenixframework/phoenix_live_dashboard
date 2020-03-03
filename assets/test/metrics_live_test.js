import { DataFns } from '../js/metrics_live'

describe('DataFns', () => {
  describe('pushDataset', () => {
    test('pushes a new label and value', () => {
      let config = dataConfig()
      let { data: {
        labels: labels,
        datasets: [{ data: data }, ..._]
      } } = config

      const foo = DataFns.pushDataset.call(config, 'foo', { y: 123 })
      expect(foo).toEqual(0)
      expect(labels[foo]).toEqual('foo')
      expect(data[foo]).toEqual(123)

      const bar = DataFns.pushDataset.call(config, 'bar', { y: 456 })
      expect(bar).toEqual(1)
      expect(labels[bar]).toEqual('bar')
      expect(data[bar]).toEqual(456)
    })
  })

  describe('indexOf', () => {
    test('returns position of a label by name', () => {
      let config = dataConfig()
      expect(DataFns.indexOf.call(config, 'foo')).toEqual(-1)

      const expected = DataFns.pushDataset.call(config, 'foo', { y: 0.01 })
      expect(DataFns.indexOf.call(config, 'foo')).toEqual(expected)
    })
  })

  describe('pushData', () => {
    test('sets a value by index', () => {
      let config = dataConfig()
      let { data: { datasets: [{ data: actual }, ..._] } } = config
      const index = DataFns.pushDataset.call(config, 'GET /', { y: 60 })

      DataFns.pushData.call(config, index, { y: 5 })
      expect(actual[index]).toEqual(5)
    })
  })

  describe('increment', () => {
    test('increments existing value', () => {
      let config = dataConfig()
      let { data: { datasets: [{ data: actual }, ..._] } } = config
      const index = DataFns.pushDataset.call(config, 'GET /', { y: 60 })

      DataFns.increment.call(config, index, { y: 5 })
      expect(actual[index]).toEqual(65)
    })
  })
})

function dataConfig() {
  return {
    data: {
      labels: [],
      datasets: [{ backgroundColor: [], data: [] }]
    }
  }
}
