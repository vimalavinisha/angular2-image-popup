#!/usr/bin/env bash

# run debug build
echo "npm run debug build on $TRAVIS_OS_NAME"
npm run buildDev
# run production build
echo "npm run production build on $TRAVIS_OS_NAME"
npm run build
# run test
echo "npm run test on $TRAVIS_OS_NAME"
npm test