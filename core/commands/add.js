'use strict'
const generator = require('igroot-generator')

module.exports = function(sl) {
  return {
    'cmd': 'add [type] [names...]',
    'desc': '新增页面或全局公共组件',
    'alias': 'a',
    'options': {},
    'handler': function (args, opts) {
      const root = opts.rootArgv
      const cmd = root._[0]
      const page = root.p
      const component = root.c

      generator.add(page, component)
    }
  }
}
