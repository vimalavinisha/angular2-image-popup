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

echo "npm run build on $TRAVIS_OS_NAME"
npm run build:all
# npm test # FIXME

echo "building the main angular-cli example with ng-packagr on $TRAVIS_OS_NAME"
ng build
ng build --prod
ng build --aot
ng test --single-run

echo "building official webpack example on $TRAVIS_OS_NAME"
cd examples/webpack
npm run build:dev
npm run build:prod
npm run build:prod:aot
npm test
cd ../..

echo "building official angular-cli example on $TRAVIS_OS_NAME"
cd examples/angular-cli
ng build
ng build --prod
ng build --aot
ng test --single-run
cd ../..

echo "building official universal example on $TRAVIS_OS_NAME"
cd examples/universal
ng build
ng build --prod
ng build --aot
npm run build:ssr
npm run build:prerender
cd ../..

