#!/usr/bin/env bash

# build typedoc documentation
echo "npm run docs on $TRAVIS_OS_NAME"
npm run docs:typedoc

# build compodoc documentation
echo "npm run compodoc on $TRAVIS_OS_NAME"
npm run docs:compodoc

# send test coverage to coveralls.io
echo "npm run coveralls on $TRAVIS_OS_NAME"
npm run coveralls

# send test data to sonarcloud.io
echo "run analyze:sonar:ci on $TRAVIS_OS_NAME"
npm run analyze:sonar:ci -- -Dsonar.login=$SONARCLOUD
