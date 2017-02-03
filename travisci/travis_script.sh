#!/usr/bin/env bash

echo "preparing build on $TRAVIS_OS_NAME"

cd demo/systemjs
npm install
cd ../..
cd demo/webpack
npm install
cd ../..

echo "npm run build on $TRAVIS_OS_NAME"
npm run build

echo "building official webpack example on $TRAVIS_OS_NAME"
cd demo/webpack
npm run build:dev
npm run build:prod
npm run build:prod:aot
npm run build:github:aot

echo "building official angular-cli example on $TRAVIS_OS_NAME"
cd ../..
cd demo/angular-cli/angular-modal-gallery-angularcli-demo
npm test # (TODO run build)

#npm run test