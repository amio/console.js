const webpack = require('webpack')
const path = require('path')

const config = {
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
  plugins: [],
  resolve: {
    alias: {
      'react': 'preact/aliases',
      'react-dom': 'preact/aliases'
    }
  },
  devtool: 'cheap-module-source-map'
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      }
    })
  )
} else {
  config.devServer = {
    contentBase: '.',
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 2708
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = config
