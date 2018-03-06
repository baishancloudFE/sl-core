'use strict'
const generator = require('sl-generator')

module.exports = function(sl) {
  return {
    'cmd': 'add [type] [names...]',
    'desc': '新增页面或全局公共组件',
    'alias': 'a',
    'options': {},
    'handler': function (args, opts) {
      generator.add(opts.rootArgv)
    }
  }
}
