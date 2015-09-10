"use strict";

const
  process  = require('child_process'),
  colors   = require('colors'),
  fse      = require('fs-extra'),
  Mustache = require('mustache'),
  logfmt   = require('logfmt'),
  through  = require('through');

colors.setTheme({
  input: 'grey',
  verbose: 'cyan',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  warning: 'yellow',
  debug: 'blue',
  error: 'red'
});

let skybotRouterPath   = __dirname + '/bin/skybot-router';
let uavDefinitionsPath = __dirname + '/vendor/Taulabs/uavobjectdefinition/'
let simulatorPath      = __dirname + '/bin/sim_posix.elf';
let skybotControlPath   = 'node_modules/.bin/skybot-control';

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

  fse.copySync(__dirname + "/template", name);

  let files = fse.readdirSync(name).map(function(filename) {
    return name + '/' + filename;
  });

  files.forEach(function(file) {
    let source = fse.readFileSync(file, "utf8")
      let content = Mustache.render(source, {name: name});

    fse.writeFileSync(file, content);
    p("info", "create", file);
  });

  process.execSync("npm install", {cwd: name});
};

actions.simulate = function() {
  p("help", "skybot", "Simulating drone");
  p("help", "skybot", "WebSocket will be available on ws://127.0.0.1:4224");
  p("help", "skybot", "Stop simulation with Ctrl-C");

  let routerLogger   = createLogger('router');
  let simulatorLogger = createLogger('simulator');
  let controlLogger   = createLogger('control');

  let router    = process.exec(skybotRouterPath + " " + uavDefinitionsPath);
  let simulator = process.exec(simulatorPath);
  let control    = process.exec(skybotControlPath);

  router.stderr.pipe(logfmt.streamParser()).pipe(through(function(object) {
    p(object.level, "router", object.msg.trim());
  }));
  router.stdout.on('data', routerLogger.info)
  router.on('close', routerLogger.close)

  control.stdout.on('data', controlLogger.info);
  control.stderr.on('data', controlLogger.warn)
  control.on('close', controlLogger.close)
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
