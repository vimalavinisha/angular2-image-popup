#!/usr/bin/env bash

# run debug build
echo "npm run build on $TRAVIS_OS_NAME"
npm run build


echo "Building demo projects on $TRAVIS_OS_NAME"
if [[ $TRAVIS_OS_NAME == 'linux' ]]; then
    npm link

    cd demo/systemjs
    npm install

    cd .. # ./demo folder

    cd webpack
    npm install
    npm link angular-modal-gallery
    cd node_modules/angular-modal-gallery
    rm -rf node_modules
    cd .. # ./demo/webpack/node_modules
    cd .. # ./demo/webpack
    npm run build:dev
    npm run build:prod
    npm run build:prod:aot
    npm run build:github:aot
else
    sudo npm link

    cd demo/systemjs
    npm install

    cd .. # ./demo folder

    cd webpack
    npm install
    npm link angular-modal-gallery
    cd node_modules/angular-modal-gallery
    rm -rf node_modules
    cd .. # ./demo/webpack/node_modules
    cd .. # ./demo/webpack
    npm run build:dev
    npm run build:prod
    npm run build:prod:aot
    npm run build:github:aot
fi


#npm run test