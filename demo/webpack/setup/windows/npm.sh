#!/bin/bash

#ONLY FOR Windows
#DON'T EXECUTE THIS - BUT USE install-windows.sh

read -p "Would you install npm global packages? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing npm global packages - also windows-build-tools and node-gyp
  npm install -g --production windows-build-tools
  npm install -g node-gyp
  npm install -g typescript@2.0.10
  npm install -g typings
  npm install -g npm-check
  npm install -g webdriver-manager
fi

read -p "Would you update webdriver-manager to be able to use Selenium Server? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo setting up a Selenium Server
  sudo webdriver-manager update
fi
