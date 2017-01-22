#!/bin/bash

#ONLY FOR Ubuntu

#To be able to execute this
#chmod a+x install-macos.sh
#bash install-macos.sh

tput setaf 2; echo "Welcome to KS89 Angular-webpack2-skeleton 1.0.0 install script for Ubuntu"

tput setaf 2; echo "Please, insert your password if requested"

read -p "Do u want to install Angular-webpack2-skeleton? Are you ready? Type y or n " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    tput setaf 1; echo "getting root privileges"
    sudo -v

    tput setaf 2; echo "updating..."
    sudo apt-get update

    tput setaf 2; echo "installing packages (for instance node.js, npm)"
    bash ubuntu/apt-get.sh

    tput setaf 6; echo "installing some global packages from npm"
    bash ubuntu/npm.sh

    tput setaf 6; echo "Thank u, bye bye!"
fi
