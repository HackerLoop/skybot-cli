# OpenSkybot CLI

SkybotCLI is used to manage drone apps from the command line. 

It's in its very early stage at the moment. Currently, it only supports
the commands `simulate` and `run` which allow to start developing,
albeit the output is still very rough.

See also
[skybot-client.js](https://github.com/openskybot/skybot-client.js) for a
javascript library providing a basic abstraction to communicate with the
drone.


This code is in its very early stage, everything is subject to change.

## Requirements 

- [NodeJs](https://nodejs.org/en/)
- optionally, a configured drone running [Taulabs Firmware](http://taulabs.org/)

## Installation

Simplest way to install is to just [dowload a
release](https://github.com/openskybot/skybot-push/releases) which come
in an osx and linux flavor. Then simply run `./skybot` after
decompressing the archive in the folder of your choice.

Or clone this repository, run `npm install` and make some symbolics
links to `skybot-router` and `sim_posix.elf` in the `bin` directory.

## Usage 

Skybot CLI comes with a couple of commands, allowing to `simulate` a
drone, `run` your code locally while being connected to the drone,
usually through usb. Create a skeleton project with `create` to get
started.

### Actions

- `skybot simulate` Run the simulator, connect to
`ws://localhost:4224` to start interacting.
- `skybot run` Run the router, connect to `ws://localhost:4224` to start interacting.
- `skybot create project_name` to create a project skeleton to get
  started with.
