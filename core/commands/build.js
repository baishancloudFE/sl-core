'use strict'

const builder = require('igroot-builder')

module.exports = function(sl) {

  return {
    'cmd': 'build',
    'desc': '执行代码构建',
    'alias': 'b',
    'options': {
      'local': {
        'alias': 'l',
        'description': '使用本地安装的 builder 执行构建',
        'boolean': true
      },
      'buildTo': {
        'alias': 't',
        'description': '构建代码存放目录',
        'slault': 'build'
      }
    },
    'handler': function (args, opts) {
      builder.build()
    }
  }
}
