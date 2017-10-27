'use strict'
const util = require('../mod/util')

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

      require(util.lookupBSYJson().builder).run()
    }
  }
}
