#!/usr/bin/env node
'use strict';

const pkg = require('./package.json')
const SlCore = require('./core')
const chalk = require('chalk')
const path = require('path')
const yargs = require('yargs')
const userHome = require('user-home')
const updateNotifier = require('update-notifier')
const co = require('co')
const assign = require('lodash.assign')
const omit = require('lodash.omit')
const debug = require('debug')('sl:index')

debug('start sl:index')

// check node version
if (process.version.slice(1) < '6.0.0') {
  console.log('您当前Node版本为：' + chalk.bold(process.version))
  console.log('运行 SL 需要' + chalk.bold('Node 6.x')+ ' 以上版本 ，请升级Node版本')
  process.exit(2)
}

// update notify
updateNotifier({pkg}).notify()

// get argv
const rootArgv = yargs.argv
const argv = process.argv.slice()
const cmd = rootArgv._[0] || ''

debug(argv)

var slConfig = {
  'home': path.join(userHome, '.sl'),
  'registry': pkg.slConfig.registry || 'https://registry.npm.taobao.org'
}


process.on('uncaughtException', throwError)
process.on('unhandledRejection', throwError)
function throwError(err, p) {
  throw err
}


let sl = null
co(function* () {
  sl = yield loadCore()
  yield runCore(sl)
}).catch(function(err) {
  throw err
})


function* loadCore() {
  return new SlCore(slConfig)
}


function* runCore(sl) {
  const opts = {
    'yargs': yargs,
    'cmd': cmd,
    'argv': argv,
    'rootArgv': rootArgv,
    'showpkg': pkg
  }

  yield run.call(sl, opts)
}


function* run(opts) {
  opts = opts || {}
  const sl = this

  const yargs = opts.yargs
  const bCmd = opts.cmd
  const argv = opts.argv
  const rootArgv = opts.rootArgv
  const pkg = opts.showpkg


  // read bsy.json
  const bsyJson = sl.lookupBSYJson() || {}



  // get kit
  const kit = {}

  kit.__action = kit.__action || {}




  // register kit commands
  sl.kitCommands.forEach(function(command) {
    kit.__action[command.name] = kit.__action[command.name] || {
      'options': {},
      'handler': command.handler
    }

    yargs.command(
      command.cmd, command.desc,
      addOptions(assign({}, command.options, kit.__action[command.name].options || {})),
      addHandler(command, function(command, cmd, args, opts) {})
    );
  });

  let unexec = true
  sl.kitCommands.forEach(function(command) {
    if (command.name === bCmd || (command.alias && rootArgv[command.alias])) {
      command.handler(argv, opts)
      unexec = false
    }
  })


  // root cmd
  if (unexec) {
    yargs.showHelp()

    return
  }

  function addOptions(options) {
    return function(yargs) {
      options = options || {}

      for (let k in options) {
        yargs.option(k, assign({}, options[k], {'group': '命令选项：'}));
      }

      return yargs
    }
  }

  function addHandler(command, fn) {
    return function(argv) {
      const cmd = argv._[0]
      const args = argv._.slice(1)
      const opts = omit(argv, '$0', '_')

      if (!opts.help && (bCmd == cmd)) {
        fn(command, cmd, args, opts).catch()
      }
    }
  }
}
