Sometimes, shy developers have really good ideas. So don't be shy and open an issue! :)

If you want to help me, modify the source code, but **before to create a pull request, follow these steps**

**Attention! This is really important**
Every time you'll run `npm install` inside an example's folder, you must rebuild all with `npm run build:all`

# A. Cleanup and initialization
1. `npm install -g lite-server @angular/cli@latest`
2. remove all `node_modules` and temp folders with compiled files (if necessary)
3. `npm install` (from the root of this project)
4. `npm run clean:all`
5. `cd examples/systemjs`
6. `npm install`
7. `cd ../..`
8. `cd examples/angular-cli`
9. `npm install`
10. `cd ../../..`
11. `cd examples/angular-cli-6`
12. `npm install`
13. `cd ../../..`
14. `cd examples/universal`
15. `npm install`
16. `cd ../../..`
17. `cd examples/angular-cli-material`
18. `npm install`
19. `cd ../../..`
20. `npm run build:all`
21. `npm run docs:typedoc` => try to open `./docs/typedoc/index.html` with the `internal library documentation`
22. `npm run docs:compodoc` => try to open `./docs/compodoc/index.html` with the `internal library documentation`
23. `npm test`
24. `npm run e2e`

# B. Run main angular-cli example
1. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `npm run build:main:dev`
4. `cd dist/apps/main/ && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ../../..`
6. `npm run build:main:prod`
7. `cd dist/apps/main/ && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
8. `cd ../../..`

# C. Run systemjs example
1. `cd examples/systemjs`
2. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `cd ../..`

# D. Run angular-cli example
1. `cd examples/angular-cli`
2. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `npm run build:dev`
4. `cd dist/angular-cli && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ../..`
6. `npm run build:prod`
7. `cd dist/angular-cli && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
8. `cd ../../../..`

# E. Run angular-cli-6 example
1. `cd examples/angular-cli-6`
2. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `npm run build:dev`
4. `cd dist/angular-cli-6 && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ../..`
6. `npm run build:prod`
7. `cd dist/angular-cli-6 && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
8. `cd ../../../..`

# F. Run universal example
1. `cd examples/universal`
2. `npm run start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `npm run build:dev`
4. `cd dist/browser && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ../..`
6. `npm run build:prod`
7. `cd dist/browser && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
8. `cd ../..`
9. `npm run build:ssr && npm run serve:ssr` => if everything is ok (also in browser's console), kill the process and go to the next step
10. `npm run build:prerender && npm run serve:prerender` => if everything is ok (also in browser's console), kill the process and go to the next step
11. `cd ../..`

# G. Run angular-cli-material example
1. `cd examples/angular-cli-material`
2. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `npm run build:dev`
4. `cd dist/angular-cli-material && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ../..`
6. `npm run build:prod`
7. `cd dist/angular-cli-material && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
8. `cd ../../../..`

# H. Create your pull request
1. **If it is ok, create your pull request specifying all the details**

<br/>
<br/>

# Only for the author @Ks89 - How to publish this on npm?

## Stable releases (@latest)
1. `cd projects/ks89/angular-modal-gallery`
2. `npm version patch` (x.x.1) or `npm version minor` (x.1.0) or `npm version major` (5.x.x)
3. `cd ../..`
4. `npm run clean:all`
5. `npm run build:lib`
6. `npm publish @ks89/angular-modal-gallery`
7. `git push origin master`
8. `git push origin vx.x.x`  <-- tag name created by npm version (for instance v5.0.1)

## Beta and RC releases (@beta)
1. `cd projects/ks89/angular-modal-gallery`
2. Manually change the version of `./libs/angular-modal-gallery/package.json` with either this format `x.x.x-beta.x` or `x.x.x-rc.x` (also respect semver!)
3. `cd ../..`
4. `npm run clean:all`
5. `npm run build:lib`
6. `npm publish @ks89/angular-modal-gallery --tag beta`

## Alpha releases (@next)
1. `cd projects/ks89/angular-modal-gallery`
2. Manually change the version of `./libs/angular-modal-gallery/package.json` with this format `x.x.x-alpha.x` (also respect semver!)
3. `cd ../..`
4. `npm run clean:all`
5. `npm run build:lib`
6. `npm publish @ks89/angular-modal-gallery --tag next`
