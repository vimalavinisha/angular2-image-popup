#!/usr/bin/env bash

echo "preparing build on $TRAVIS_OS_NAME"

cd demo/systemjs
npm install
cd ../..
cd demo/webpack
npm install
cd ../..
cd demo/angular-cli/angular-modal-gallery-angularcli-demo
npm install
cd ../../..

echo "npm run build on $TRAVIS_OS_NAME"
npm run build
# npm test # TODO

#echo "building official webpack example on $TRAVIS_OS_NAME"
#cd demo/webpack
#npm run build:dev
#npm run build:prod
#npm run build:prod:aot
#npm test
#cd ..

echo "building official angular-cli example on $TRAVIS_OS_NAME"
cd demo/angular-cli/angular-modal-gallery-angularcli-demo
npm run build
# npm test # TODO