const path = require('path')
const glob = require('glob')

module.exports = {
  entry: {
    './js/phoenix_live_dashboard.js': glob.sync('./vendor/**/*.js').concat(['./js/phoenix_live_dashboard.js'])
  },
  output: {
    filename: 'phoenix_live_dashboard.js',
    path: path.resolve(__dirname, '../priv/static'),
    library: 'phoenix_live_dashboard',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  plugins: []
}
