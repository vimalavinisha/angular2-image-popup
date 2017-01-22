#!/bin/bash

#ONLY FOR macOS

#To be able to execute this
#chmod a+x install-macos.sh
#bash install-macos.sh

tput setaf 2; echo "Welcome to KS89 Angular-webpack2-skeleton 1.0.0 install script for macOS"

tput setaf 2; echo "Attention! If you want to run this script install the latest version of Xcode command line developer"
tput setaf 2; echo "Please, insert your password if requested"

read -p "Do u want to install Angular-webpack2-skeleton? Are you ready? Type y or n " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    tput setaf 1; echo "getting root privileges"
    sudo -v

    tput setaf 2; echo "installing homebrew and packages (for instance node.js and npm)"
    bash macos/homebrew.sh

    tput setaf 4; echo "installing some global packages from npm"
    bash macos/npm.sh

    tput setaf 6; echo "Thank u, bye bye!"
fi
