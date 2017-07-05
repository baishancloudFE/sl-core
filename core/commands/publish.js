'use strict';

module.exports = function(sl) {

  return {
    'cmd': 'publish [type]',
    'desc': '执行代码发布',
    'alias': 'p',
    'options': {
      'daily': {
        'alias': 'd',
        'description': '发布到日常环境'
      },
      'prepub': {
        'alias': 'u',
        'description': '发布到预发环境（仅对 webapp、package 生效）'
      },
      'preprod': {
        'alias': 'r',
        'description': '发布到线上预览环境（仅对 webapp、package 生效）'
      },
      'prod': {
        'alias': 'o',
        'description': '发布到线上环境'
      },

      'config': {
        'alias': 'c',
        'description': '配置 webapp 或者 package'
      },

      'field': {
        'description': '指定配置选项字段，用于多离线包发布（兼容旧版）'
      },
      'no-upload': {
        'alias': 'U',
        'description': '只生成离线包，不执行发布'
      },

      'push': {
        'description': '发布前强制 push 代码'
      },
      'clear': {
        'description': '线上发布成功后切换到 master 分支并同步远程代码'
      },
      'no-deletebranch': {
        'alias': 'D',
        'description': '线上发布成功后不删除源 daily 分支'
      },

      'env': {
        'alias': 'e',
        'description': '预留调试参数，请勿使用'
      }
    },
    'handler': function* (args, opts) {
      var client = require('@ali/sl-pub-client');
      var Promise = require('bluebird');
      var inquirer = require('inquirer');

      // support log level
      client.log.level = sl.log.level;

      sl.log.info('正在获取用户信息...');
      var user = yield sl.login().login();
      sl.log.info('成功获取用户信息');

      var abc = sl.lookupABCJson() || {};
      var types = ['assets', 'webapp', 'package'];

      var choices = [
        {
          'name': '执行 assest（JS、CSS）发布',
          'value': 'assets',
          'short': 'sl p assets'
        }
      ];
      if (abc.awpWebapp) {
        choices.push({
          'name': '执行 webapp（AWP HTML 页面）发布',
          'value': 'webapp',
          'short': 'sl p webapp'
        });
      }
      if (abc.awpZipapp) {
        choices.push({
          'name': '执行 package（AWP 离线包）发布',
          'value': 'package',
          'short': 'sl p package'
        });
      }

      var tipMap = {
        '1': '发布到日常（daily）环境',
        '2': '发布到预发（prepub）环境',
        '3': '发布到预上线（preprod）环境',
        '4': '发布到线上（prod）环境'
      };
      var fnMap = {
        'assets': doAssets,
        'webapp': doWebapp,
        'package': doPackage
      };

      var type = args[0] || '';
      sl.log.verbose('sl.publish', 'type->', type);
      if (types.indexOf(type) == -1) {
        if (type == '') {
          if (choices.length > 1) { // 选择
            type = yield askForType(choices);
            fnMap[type]();
          } else { // 直接走 assets 类型
            fnMap['assets']();
          }
        } else {
          type = yield askForType(choices, type);
          fnMap[type]();
        }
      } else { // 走特定发布类型
        fnMap[type]();
      }

      function getEnv(slaultEnv) {
        var env = slaultEnv;
        if (opts.daily) {
          env = 1;
        } else if (opts.prepub) {
          env = 2;
        } if (opts.preprod) {
          env = 3;
        } else if (opts.prod) {
          env = 4;
        }
        return env;
      }

      function doAssets() {
        var env = getEnv(1);
        if (env == 1) {
          sl.log.info('执行 assets 发布，' + tipMap[env]);
          helpOpts('assets');
          return client.daily({
            'env': opts.env,
            'push': !!opts.push,
            'empId': user.empId
          });
        } else if (env == 4) {
          sl.log.info('执行 assets 发布，' + tipMap[env]);
          helpOpts('assets');
          if (opts.noDeletebranch) {
            sl.log.warn('你指定了 `no-deletebranch` 选项，发布完成后将不会删除源 daily 分支');
          }
          return client.cdn({
            'env': opts.env,
            'empId': user.empId,
            'options': {
              'no_delete_branch': !!opts.noDeletebranch
            },
            'clear': !!opts.clear
          });
        } else {
          sl.log.error('assets 发布不支持发布到' + tipMap[env]);
          helpOpts('assets');
        }

      }

      function doWebapp() {
        var env = getEnv(2);
        if (!opts.config) {
          sl.log.info('执行 webapp 发布，' + tipMap[env]);
          helpOpts('webapp');
        }
        return client.webapp({
          'env': opts.env,
          'awp_env': env,
          'empId': user.empId,
          'config': !!opts.config
        });
      }

      function doPackage() {
        var env = getEnv(2);
        if (!opts.config) {
          sl.log.info('执行 package 发布，' + tipMap[env]);
          helpOpts('package');
          if (opts.noUpload) {
            sl.log.warn('你指定了 `no-upload` 选项，离线包将不会被发布');
          }
        }
        return client.package({
          'env': opts.env,
          'awp_env': env,
          'empId': user.empId,
          'field': opts.field,
          'noupload': !!opts.noUpload,
          'config': !!opts.config
        });
      }

      function askForType(choices, unknown) {
        var message = '当前仓库可以执行多种发布操作';
        if (unknown) {
          message = '不能识别提供的发布类型 `' + unknown + '`'
        }
        message += '，请选择您需要的操作？';

        return new Promise(function resolver(resolve, reject) {
          var config = {
            'type': 'list',
            'message': message,
            'choices': choices,
            'name': 'type'
          };

          inquirer.prompt(
            [config],
            function(answer) {
              resolve(answer.type);
            }
          );
        });
      }

      function helpOpts(type) {
        console.log('======================================');
        console.log('还可以通过下列命令来发布到不同环境：');
        console.log('sl p ' + type + ' --daily, -d', '日常环境' +
          (type == 'assets' ? ' [默认]' : '')
        );
        if (type == 'webapp' || type == 'package') {
          console.log('sl p ' + type + ' --prepub, -u', '预发环境 [默认]');
          console.log('sl p ' + type + ' --preprod, -r', '线上预览环境');
        }
        console.log('sl p ' + type + ' --prod, -o', '线上环境');
        console.log('======================================');
      }

    }
  };

};