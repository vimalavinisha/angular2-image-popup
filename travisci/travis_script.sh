#!/usr/bin/env bash

# run debug build
echo "npm run build on $TRAVIS_OS_NAME"
npm run build

cd demo/systemjs
npm install
cd ../..
cp -r dist/. demo/systemjs/node_modules/angular-modal-gallery

cd demo/webpack
npm install
cd ../..
cp -r dist/. demo/webpack/node_modules/angular-modal-gallery
cd demo/webpack
npm run build:dev
npm run build:prod
npm run build:prod:aot
npm run build:github:aot

#npm run test