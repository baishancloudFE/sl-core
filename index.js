#!/usr/bin/env node

let config
try { config = require('./sl.json') }
catch (e) { config = {} }

const fs = require('fs')
const npm = require('npm')
const prefix = config.source || 'https://raw.githubusercontent.com/baishancloudFE/sl-client/master'
const cache = {}

checkDependencies(() => run(argvHandle(process.argv)))

/**
 * 检查依赖
 * @param {Function} callback 
 */
function checkDependencies(callback) {
  _require('/package.json', JSON.parse).then(({devDependencies}) => {
    const modules = Object.keys(devDependencies).map(package => {
      const version = devDependencies[package] = devDependencies[package].replace(/^\^|~/, '')

      let currentVersion
      try {currentVersion = require(`./node_modules/${package}/package.json`).version}
      catch(e) {currentVersion = ''}

      if (currentVersion === version) return ''
      else return `${package}@${version}`
    }).filter(_module => !!_module)

    install(modules, callback)
  })

  /**
   * 安装依赖
   * @param {Array[String]} modules
   * @param {Function} callback
   */
  function install(modules, callback) {
    if (modules.length === 0)
      return callback && callback()

    const prefix = __dirname

    npm.load({ prefix, registry: 'https://registry.npm.taobao.org' }, function (err) {
      if (err) {
        console.error(err)
        console.log('\u001b[31m\n\n> Client error: Failed to load npm.\n\u001b[39m')
        return
      }

      console.log('\u001b[90m> Uploading dependencies modules. This might take a couple of minutes.\u001b[39m')

      npm.install(prefix, ...modules, function (err) {
        if (err) {
          console.error(err)
          console.log('\u001b[31m\n\n> Client error: Failed to update dependencies.\n\u001b[39m')
          return
        }

        console.log('\u001b[32m> Updated.\u001b[39m')
        callback && callback()
      })
    })
  }
}

/**
 * 分割系统参数
 * @param {Arrat[String]} argv 
 * @return 
 */
function argvHandle(argv) {
  const result = {}

  argv.slice(2).forEach(arg => {
    if (arg.indexOf('--') === 0) {
      const part = arg.slice(2)

      if (part.indexOf('=') > 0) {
        const [key, value] = part.split('=')
        result[key] = value

        return
      }

      if (part.indexOf('no-') === 0)
        result[part.slice(3)] = false

      else
        result[part] = true

      return
    }

    if (arg.indexOf('-') === 0 && arg.length === 2)
      return result[arg[1]] = true

    if (arg.indexOf('=') > 0) {
      const [key, value] = part.split('=')
      result[key] = value

      return
    }

    result[arg] = true
  })

  return result
}

/**
 * 命令执行
 * @param {Object} args
 */
function run(args) {
  _require('/main').then(main => main(args))
}

/**
 * require 网络版
 * @param {String}   uri    文件地址
 * @param {Function} handle 请求到的文件处理函数
 */
function _require(uri, handle = code => eval(code)) {
  if (!cache[uri]) {
    const filename = uri.split('/').pop()
    const suffix = filename.indexOf('.') === -1 ? '.js' : ''
    const isFull = /^https?:\/\//.test(uri)
    const url = (isFull ? '' : prefix) + uri + suffix

    cache[uri] = new Promise((resolve, reject) => {
      const protocol = prefix.split(':')[0]

      require(protocol).get(url, res => {
        if (res.statusCode !== 200)
          throw new Error('Failed to get the client code!')

        let code = ''
        res.setEncoding('utf8')
        res.on('data', chunk => code += chunk)
        res.on('end', () => resolve(handle(code)))
        res.on('error', reject)
      })
    })
  }

  return cache[uri]
}