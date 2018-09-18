const path = require('path')
const GenerateLicense = require('./src/generate-license-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/typer.js'),
  target: 'web', // Default.
  output: {
    path: path.resolve(),
    filename: 'typer.min.js',
    library: 'typer',
    libraryTarget: 'umd' // "Universal" export - Node, browser, amd, etc.
  },
  module: {
    rules: [
      {
        test: /typer.js/,
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
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'typer.css'
    }),
    new GenerateLicense({
      template: path.resolve(__dirname, 'src/LICENSE.txt'),
      outputPath: path.resolve(),
      outputName: 'LICENSE.txt',
      placeholders: {
        year: new Date().getFullYear(),
        author: 'Aaron Cordova'
      }
    })
  ]
}
