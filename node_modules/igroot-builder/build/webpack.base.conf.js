const path = require('path')
const utils = require('./utils')
const config = require('../config')
const isProd = process.env.NODE_ENV === 'production'

function resolve(dir = '') {
  return path.join(process.cwd(), dir)
}

const entry = {}
utils.subdir().forEach(dir => entry[dir] = resolve(`src/pages/${dir}/index.jsx`))

module.exports = {
  entry,

  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: resolve('src'),
        options: {
          presets: [
            "es2015",
            "react",
            "stage-0"
          ],
          plugins: [
            ["import", {
              "libraryName": "igroot",
              "style": utils.appConfig('theme')
                ? true
                : "css"
            }]
          ],
          filename: __dirname
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  context: path.join(__dirname, '../')
}
