#!/usr/bin/env bash

echo "Before script - OS is $TRAVIS_OS_NAME"

echo "Setting xvfb based on TRAVIS_OS_NAME"
# setting xvfb on Linux https://docs.travis-ci.com/user/gui-and-headless-browsers/#Using-xvfb-to-Run-Tests-That-Require-a-GUI
if [[ $TRAVIS_OS_NAME == 'linux' ]]; then
    # config required to run browsers
    export DISPLAY=:99.0
    echo "DISPLAY is $DISPLAY"
    sh -e /etc/init.d/xvfb start
    sleep 3 # give xvfb some time to start
fi
