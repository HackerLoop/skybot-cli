#!/usr/bin/env bash

hasCommand() {
  command -v $1 >/dev/null 2>&1
}

if hasCommand node; then
  echo "Checking if node is installed: ✓"
  echo "TOOO"
  exit 0
else
  echo "Checking if node is installed: ✗"
  if hasCommand brew; then
    brew install node
  else
    echo "Can't install nodejs, please install brew (http://brew.sh/) ?"
    exit 1
  fi
fi

