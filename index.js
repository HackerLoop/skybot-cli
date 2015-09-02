"use strict";

const
  process  = require('child_process'),
  colors = require('colors');

colors.setTheme({
  input: 'grey',
  verbose: 'cyan',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

let skybotRouterPath   = './bin/skybot-router';
let uavDefinitionsPath = './vendor/Taulabs/uavobjectdefinition/'
let simulatorPath      = './bin/sim_posix.elf';


let actions = {};

let p = function(level, prefix, message) {
  console.log((prefix + ": " + message)[level]);
};

// TODO use https://github.com/samcday/node-stream-splitter
let createLogger = function(prefix) {
  return {
    info: function(msg) { p('info', prefix, msg.trim()) },
    warn: function(msg) { p('warn', prefix, msg.trim()) },
    close:  function(code) {
      if(code !== 0) {
        p('error', prefix, "exit with code " + code);
      }
    }
  };
};

actions.create = function(name) {
  p("info", "skybot", "Creating " + name);
};

actions.simulate = function() {
  p("help", "skybot", "Simulating ...");
  p("help", "skybot", "Stop execution with Ctrl-C");

  let routerLogger    = createLogger('skybot-router');
  let simulatorLogger = createLogger('simulator');

  let router    = process.exec(skybotRouterPath + " " + uavDefinitionsPath);
  let simulator = process.exec(simulatorPath);

  router.stdout.on('data', routerLogger.info);
  router.stderr.on('data', routerLogger.warn)
  router.on('close', routerLogger.close)

  simulator.stdout.on('data', simulatorLogger.info);
  simulator.stderr.on('data', simulatorLogger.warn)
  simulator.on('close', simulatorLogger.close)
}

actions.run = function(pwd, env) {
  p("info", "skybot", "Running " + pwd + " in enviroment " + env);
};

actions.push = function() {
  p("info", "skybot", "Pushing ");
};

exports.actions = actions;
