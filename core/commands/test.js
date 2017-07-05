'use strict';

module.exports = function(sl) {

  return {
    'cmd': 'test [type]',
    'desc': '执行代码测试',
    'alias': 't',
    'options': {},
    'handler': function* (args, opts) {
      sl.log.warn('默认逻辑不提供此功能');
    }
  };

};