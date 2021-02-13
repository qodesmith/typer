import postcss from 'rollup-plugin-postcss'
import {terser} from 'rollup-plugin-terser'
import {getBabelOutputPlugin} from '@rollup/plugin-babel'

export default {
  input: './src/typer.js',
  output: {
    file: './dist/typer.min.js',
    format: 'umd',
    name: 'typer',
    plugins: [
      getBabelOutputPlugin({
        presets: ['@babel/preset-env'],
        allowAllFormats: true,
      }),
      terser({compress: {passes: 3}, mangle: {toplevel: true}}),
    ],
  },
  plugins: [postcss({extract: true})],
}
