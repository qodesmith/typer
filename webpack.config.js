const path = require('path')
const GenerateLicense = require('./src/generate-license-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = (env, argv) => ({
  mode: env.prod ? 'production' : 'development',
  /*
    During development, the devserver should serve an html file including 2 assets:
      * typer.js - our library.
      * sandbox - our code used during development for testing.

    We use an object here during development so that we can later correctly order
    these two assets on the html page served up as the dev server. We want Typer to be first.

    Used in conjunction with the following webpack properties:
      * output.filename
      * plugins => HtmlWebpackPlugin => chunks & chunksSortMode
  */
  entry: env.prod ? path.resolve(__dirname, 'src/typer.js') : {
    typer: path.resolve(__dirname, 'src/typer.js'),
    sandbox: path.resolve(__dirname, 'src/sandbox.js')
  },
  target: 'web', // Default.
  output: {
    path: path.resolve(),
    /*
      When building for production, we emit a single minified asset for the Typer library.
      When developing, we need each asset in the `entry` property above to be unique,
      hence the dynamically generated `[name]` placeholder.
    */
    filename: env.prod ? 'typer.min.js' : '[name].js',
    library: 'typer',
    libraryTarget: 'umd' // "Universal" export - Node, browser, amd, etc.
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    open: true,
    port: 9001,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
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
        test: /typer.css/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'typer.css' }),
    env.prod && new GenerateLicense({
      template: path.resolve(__dirname, 'src/LICENSE.template.txt'),
      outputPath: path.resolve(),
      outputName: 'LICENSE.txt',
      placeholders: {
        year: new Date().getFullYear(),
        author: 'Aaron Cordova'
      }
    }),
    !env.prod && new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.ejs'),
      title: 'Typer Sandbox',
      chunksSortMode: 'manual',
      chunks: ['typer', 'sandbox']
    }),
  ].filter(Boolean)
})
