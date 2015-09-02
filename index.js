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

let skybotRouterPath   = __dirname + '/bin/skybot-router';
let uavDefinitionsPath = __dirname + '/vendor/Taulabs/uavobjectdefinition/'
let simulatorPath      = __dirname + '/bin/sim_posix.elf';

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
  p("help", "skybot", "Simulating drone");
  p("help", "skybot", "WebSocket will be available on ws://127.0.0.1:4224");
  p("help", "skybot", "Stop simulation with Ctrl-C");

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

actions.run = function() {
  p("help", "skybot", "Starting router locally");
  p("help", "skybot", "WebSocket will be available on ws://127.0.0.1:4224");
  p("help", "skybot", "Stop router with Ctrl-C");

  let routerLogger    = createLogger('skybot-router');
  let router    = process.exec(skybotRouterPath + " " + uavDefinitionsPath);
  router.stdout.on('data', routerLogger.info);
  router.stderr.on('data', routerLogger.warn)
  router.on('close', routerLogger.close)
};

actions.push = function() {
  p("help", "skybot", "Pushing ");
  p("help", "skybot", "TODO ");
};

exports.actions = actions;
