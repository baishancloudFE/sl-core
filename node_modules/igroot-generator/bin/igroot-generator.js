#!/usr/bin/env node

const path = require('path')
const init = require('../command/init')
const add = require('../command/add')

require('yargs')
    .usage('iGroot Generator')
    .command(
        'init',
        'Initialize Groot application',
        {},
        argv => init(argv._[1])
    )

    .command(
        'add',
        'arguments description:\n \t-p [name]\tAdd a new page to ./src/pages\n \t-c [name]\tAdd a new component to ./src/components',
        {},
        argv => add(argv.p, argv.c)
    )
    
    .demandCommand()
    .help()
    .alias('h', 'help')
    .epilog('Copyright 2017 By BaishanCloud')
    .argv
