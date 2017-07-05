"use strict";

const util = require('./mod/util')
const pkg = require('../package.json')
const path = require('path')
const co = require('co')
const _ = require('lodash')
const debug = require('debug')('sl:core')

function SL(opts) {
  const sl = this

  opts = opts || {}

  // env
  sl.home = opts.home
  sl.pkg = pkg
  sl.name = pkg.name
  sl.description = pkg.description
  sl.version = pkg.version

  sl.env = {
    'home': sl.home,
    'softHome': sl.softHome,
    'version': sl.version,
    'env': 'production'
  }

  // commands
  sl._commands = {}
  sl._alias = {}

  // kits
  sl._kits = {}

  debug('core init')

  sl.init(opts)
}

SL.prototype = {
  init: function(opts) {
    const sl = this

    opts = opts || {}

    sl.registerCommands()
  },

  registerCommands: function() {
    const sl = this

    sl.alias = {}

    sl._kitCommands = [
      'init', 'add', 'dev', 'build'
    ]

    sl.kitCommands = sl._kitCommands.map(register)

    sl.commands = {}
    sl.kitCommands.forEach(add)

    function register(c) {
      const p = path.join(__dirname, './commands', c)
      const cmd = require(p)(sl)

      cmd.name = c
      sl.alias[cmd.alias] = c

      return cmd
    }

    function add(cmd) {
      sl.commands[cmd.name] = cmd
    }
  },

  lookupBSYJson: util.lookupBSYJson,

  registerKit: function(name) {
    const sl = this
    let kit

    kit = sl._kits[name]

    if (kit) {
      return kit
    }
  }
}

module.exports = SL
