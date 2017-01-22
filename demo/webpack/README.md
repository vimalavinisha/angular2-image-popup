# Angular4-webpack2-skeleton
A simple skeleton project to use Angular4, Webpack2, Boostrap 4 alpha and bootstrap-loader 2 beta together


I created this project as an example for this issue: https://github.com/shakacode/bootstrap-loader/issues/191#issuecomment-256352654
After that, I decided to update it based on https://github.com/Ks89/My-MEAN-website-client
And I created some branches for this issue: https://github.com/ampedandwired/html-webpack-plugin/issues/481

This project is a personal skeleton. If you want to use it feel free to fork it.
I share this with you as it is.

I'll update this project in the future and I'll change the name to another one when Angular4 will be released.

## News
- *01/22/2017* - Alpha 7 - Check [HERE](https://github.com/Ks89/Angular2-webpack2-skeleton/releases)
- *01/21/2017* - Alpha 6 - Check [HERE](https://github.com/Ks89/Angular2-webpack2-skeleton/releases)
- *01/15/2017* - Alpha 5 - Check [HERE](https://github.com/Ks89/Angular2-webpack2-skeleton/releases)


## Changelog

#### Alpha 7
- AOT + Lazy Loading together (thanks to `ng-router-loader`)

#### Alpha 6
- AOT #9

#### Alpha 5
- HMR
- Lazy Loading
- Tree Shaking (with webpack2 and not with rollup)
- Third party services as codeclimate, appveyor, travis ci and coveralls
- Massive refactoring


## Install global dependencies
I created some scripts inside 'setup' folder to initialize the environment.
If you are already ready, you can execute this (`sudo` if you are using macOS):

- `npm install -g typings`
- `npm install -g lite-server`

## Install local dependencies
- `npm install`

## Run with webpack-dev-server (developing mode)
- `npm start`

## Build the application in 'dist' folder (debug mode)
- `npm run buildDev`
- `cd dist`
- `lite-server`

## Build the application in 'dist' folder (production mode)
- `npm run build`
- `cd dist`
- `lite-server`

## Build the application in 'dist' folder (production + AOT mode)
- `npm run build:aot:prod`
- `cd dist`
- `lite-server`

## Test (check coverage/html/index.html with the results)
- `npm test`

## Test e2e with protractor (broken)
~~- `npm run e2e`~~

I'll fix this issue in upcoming versions. Please be patient.


## License

Copyright 2016-2017 Stefano Cappa

**This license is valid to all my files in this repo**

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

<br/>
**Created by Stefano Cappa**
