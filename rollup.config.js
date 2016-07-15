import riot from 'rollup-plugin-riot'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/main.js',
  dest: 'dist/bundle.js',
  format: 'umd',
  moduleName: 'Console',
  plugins: [
    riot(),
    nodeResolve({
      main: true,   // if provided in CommonJS
      jsnext: true, // if provided in ES6
      browser: true // if provided for browsers
    }),
    commonjs(),
    babel({
      'presets': [ 'es2015-rollup' ],
      'compact': 'auto'
    })
  ]
}
