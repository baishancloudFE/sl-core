'use strict';

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const _ = require('lodash')

var filepathKey = '____bsyfile____'

exports.lookupBSYJson = function(cwd) {
  cwd = cwd || process.cwd()

  let bsy
  try {
    bsy = require(path.join(cwd, 'bsy.json'))
  } catch(e) {
    bsy = {}
  }

  return bsy
}

exports.getKitList = function() {
  return ['igroot']
}

exports.confirm = function confirm(msg) {
  return _confirm;

  function _confirm() {
    return new Promise(function resolver(resolve, reject) {
      inquirer.prompt(
        [{'type': 'confirm', 'name': 'ok', 'message': msg}],
        function(answer) { resolve(answer.ok); }
      )
    })
  }
}
