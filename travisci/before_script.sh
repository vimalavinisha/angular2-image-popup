#!/usr/bin/env bash

echo "Before script - OS is $TRAVIS_OS_NAME"

# rebuild again node-sass
npm rebuild node-sass

echo "Setting xvfb based on TRAVIS_OS_NAME"
# setting xvfb on Linux https://docs.travis-ci.com/user/gui-and-headless-browsers/#Using-xvfb-to-Run-Tests-That-Require-a-GUI
# config required to run browsers
export DISPLAY=:99.0
echo "DISPLAY is $DISPLAY"
sh -e /etc/init.d/xvfb start
sleep 3 # give xvfb some time to start

# codeclimate test reporter
echo "Preparing codeclimate test reporter - OS is $TRAVIS_OS_NAME"
curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
chmod +x ./cc-test-reporter
./cc-test-reporter before-build
