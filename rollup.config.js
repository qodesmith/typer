import postcss from 'rollup-plugin-postcss'
import {terser} from 'rollup-plugin-terser'

export default {
  input: './src/typer.js',
  output: {
    file: './dist/typer.min.js',
    format: 'umd',
    name: 'typer',
    plugins: [terser({compress: {passes: 3}, mangle: {toplevel: true}})],
  },
  plugins: [postcss({extract: true})],
}
