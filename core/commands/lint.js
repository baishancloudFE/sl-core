'use strict'

const builder = require('igroot-builder')

module.exports = function(sl) {

  return {
    'cmd': 'lint',
    'desc': '检查并修复 src 目录下的代码格式',
    'alias': 'lt',
    'options': {},
    'handler': function(args, opts) {
      builder.lint(opts.rootArgv.fix !== false)
    }
  }

}
