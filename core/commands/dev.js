'use strict'
const util = require('../mod/util')
const chalk = require('chalk')

module.exports = function(sl) {
  return {
    'cmd': 'dev',
    'desc': '开启本地调试服务器',
    'alias': 'd',
    'options': {
      'port': {
        'alias': 'p',
        'description': '调试服务器监听端口',
        'slault': 3333,
        'number': true
      },
      'lrPort': {
        'alias': 'r',
        'description': 'live reload 服务器监听端口',
        'number': true
      },
      'open-url': {
        'alias': 'o',
        'description': '自动打开预览 url',
        'slault': false,
        'boolean': true
      },
      'no-livereload': {
        'alias': 'L',
        'description': '禁止 live reload'
      }
    },
    'handler': function (args, opts) {
      const root = opts.rootArgv
      const cmd = root._[0]
      const page = root.p || ''

      console.log(chalk.blue('v2.0迁移指南: ') + chalk.underline('https://github.com/baishancloudFE/sl-core/wiki/SL-v2.0%E8%BF%81%E7%A7%BB%E6%8C%87%E5%8D%97'))
      console.log('\n')
      require(util.lookupBSYJson().builder).dev()
    }
  }
}
