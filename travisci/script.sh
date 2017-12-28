#!/usr/bin/env bash

echo "preparing build on $TRAVIS_OS_NAME"

npm run clean:all

cd examples/systemjs
npm install
cd ../..
cd examples/webpack
npm install
cd ../..
cd examples/angular-cli
npm install
cd ../..
cd examples/universal
npm install
cd ../..

echo "npm run build library on $TRAVIS_OS_NAME"
npm run build:all

echo "building the main angular-cli example with ng-packagr on $TRAVIS_OS_NAME"
npm run build:main:dev
npm run build:main:prod
npm run test:ci

echo "building official webpack example on $TRAVIS_OS_NAME"
cd examples/webpack
npm run build:dev
npm run build:prod
npm run build:prod:aot
npm test
cd ../..

echo "building official angular-cli example on $TRAVIS_OS_NAME"
cd examples/angular-cli
npm run build:dev
npm run build:prod
npm run test:ci
cd ../..

echo "building official universal example on $TRAVIS_OS_NAME"
cd examples/universal
npm run build:dev
npm run build:prod
npm run build:ssr
npm run build:prerender
#npm test
cd ../..

echo "testing library on $TRAVIS_OS_NAME"
npm run test:ci
npm run e2e:ci
