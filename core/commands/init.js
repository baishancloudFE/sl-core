'use strict'

const generator = require('igroot-generator')

module.exports = function(sl) {

  return {
    'cmd': 'init [type]',
    'desc': '初始化项目目录结构',
    'alias': 'it',
    'options': {},
    'handler': function(args, opts) {
      const root = opts.rootArgv
      const cmd = root._[0]

      console.log('igroot generator init:')
      generator.init('./')
    }
  }

}
