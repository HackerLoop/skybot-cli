#! /usr/bin/env node --harmony
"use strict"

var program = require('commander');

let actions = require('./index').actions;
let cmd  = undefined,
    args = undefined;

program
  .version('0.0.1-alpha')
  .option('-v', '--verbose', 'Print additional details')
  .action(function(c, a) {
    cmd   = c;
    args  = a;
  });

program.parse(process.argv);

if(!actions.hasOwnProperty(cmd) || cmd == undefined) {
  program.help();
}

actions[cmd](args);
