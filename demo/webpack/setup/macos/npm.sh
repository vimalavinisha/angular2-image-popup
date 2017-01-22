#!/bin/bash

#ONLY FOR macOS
#DON'T EXECUTE THIS - BUT USE install-macos.sh

read -p "Would you install npm global packages? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing npm global packages
  sudo npm install -g typescript@2.0.10
  sudo npm install -g typings
  sudo npm install -g npm-check
  sudo npm install -g webdriver-manager
fi

read -p "Would you update webdriver-manager to be able to use Selenium Server? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo setting up a Selenium Server
  sudo webdriver-manager update
fi
