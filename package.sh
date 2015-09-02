#!/usr/bin/env bash

has_command() {
  command -v $1 >/dev/null 2>&1
}

copy_files() {
  mkdir -p $1/bin
  
  if [ $OS == 'Linux' ]; then
    cp vendor/Taulabs/linux/* $1/bin
    cp vendor/skybot-router/linux/* $1/bin
  fi

  if [ $OS == 'Mac' ]; then
    cp vendor/Taulabs/osx/* $1/bin
    cp vendor/skybot-router/osx/* $1/bin
  fi

  mkdir -p $1/vendor/Taulabs
  cp -R vendor/Taulabs/uavobjectdefinition $1/vendor/Taulabs/uavobjectdefinition
  cp package.json $1/
  cp *.js $1/

  pushd .
  cd $1

  ln -s "`pwd`/cli.js" bin/skybot
  chmod +X bin/skybot

  npm install
  popd

  echo "Skybot packaged into $1"
}

OS="`uname`"
case $OS in
  'Linux')
    OS='Linux'
    ;;
  'WindowsNT')
    OS='Windows'
    exit 1
    ;;
  'Darwin') 
    OS='Mac'
    ;;
  *) ;;
esac

if has_command node; then
  echo "Checking if node is installed: ✓"
  # curl -L -O "https://github.com/openskybot/release-v0.0.01-alpha"
  copy_files $1
  exit 0
else
  echo "Checking if node is installed: ✗"
  if has_command brew; then
    brew install node
  else
    echo "Can't install nodejs, please install brew (http://brew.sh/) ?"
    exit 1
  fi
fi

