#!/bin/bash

#ONLY FOR Ubuntu
#DON'T EXECUTE THIS - BUT USE install.sh, please

echo installing packages, only if not already available
sudo apt-get install git
sudo apt-get install tig

read -p "Would you install Node.js and npm? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing nodejs and npm
  curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
  sudo apt-get install -y nodejs
  sudo apt-get install -y build-essential
fi
