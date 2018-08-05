const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/typer.js'),
  target: 'web', // Default.
  output: {
    path: path.resolve(),
    filename: 'typer.min.js',
    library: 'typer',
    libraryTarget: 'umd' // "Universal" export - Node, browser, amd, etc.
  },
  resolve: {
    alias: {
      modules: path.resolve(__dirname, 'src/modules')
    },
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /typerz.js/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      },
      {
        test: /typer.less/,
        use: [
          'less-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: []
}
