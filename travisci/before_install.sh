#!/bin/bash

echo "Before install - OS is $TRAVIS_OS_NAME"

# switch to npm latest
npm install -g npm@latest
npm cache verify
npm prune
npm update

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
