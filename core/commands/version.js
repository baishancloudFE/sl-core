'use strict'

module.exports = function (sl) {
  return {
    'cmd': 'version',
    'desc': '查看当前 sl 版本',
    'alias': 'v',
    'options': {},
    'handler': function (args, opts) {
      const {version} = require('../../package.json')
      console.log('v' + version)
    }
  }
}
