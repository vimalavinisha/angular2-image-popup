#!/bin/bash

echo "Before install - OS is $TRAVIS_OS_NAME"

echo "Exporting env variables dependencies"
# export env variables, thanks to https://github.com/travis-ci/travis-ci/issues/7099
if [[ $TRAVIS_OS_NAME = 'osx' ]]; then
    echo "Exporting env variables - OS is $TRAVIS_OS_NAME"
    export NODE_ENV=test CI=yes;
    echo "NODE_ENV = $NODE_ENV"
    echo "CI = $CI"
    echo "Exporting env variables - done"
else
    echo "Exporting env variables - OS is $TRAVIS_OS_NAME"
    export CXX=g++-4.8 NODE_ENV=test CI=yes
    echo "CXX = $CXX"
    echo "NODE_ENV = $NODE_ENV"
    echo "CI = $CI"
    echo "Exporting env variables - done"
fi

echo "Installing global dependencies"
# install global dependencies
if [[ $TRAVIS_OS_NAME = 'osx' ]]; then
    echo "Installing $TRAVIS_OS_NAME global dependencies"
    sudo npm install -g webpack@2.2.0-rc.4
    sudo npm install -g typescript@2.0.10
    sudo npm install -g typings
    sudo npm install -g webdriver-manager
    sudo npm install -g protractor
else
    echo "Installing $TRAVIS_OS_NAME global dependencies"
    # to fix a problem with nodejs 6 on linux
    npm install -g webpack@2.2.0-rc.4
    npm install -g typescript@2.0.10
    npm install -g typings
    npm install -g webdriver-manager
    npm install -g protractor
fi



# - sudo apt-get update
# - sudo apt-get install -y libappindicator1 fonts-liberation
# - wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# - sudo dpkg -i google-chrome*.deb
# - export CHROME_BIN=/usr/bin/google-chrome
