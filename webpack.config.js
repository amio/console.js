const path = require('path')

module.exports = {
  entry: './src/console.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'console.js',
    library: 'Console',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015-webpack', 'react']
        }
      }
    ]
  },
  resolve: {
    alias: {
      'react': 'preact/aliases',
      'react-dom': 'preact/aliases'
    }
  }
}
