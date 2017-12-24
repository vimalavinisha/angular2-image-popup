Sometimes, shy developers have really good ideas. So don't be shy and open an issue! :)

If you want to help me, modify the source code, but **before to create a pull request, follow these steps**

**Attention! This is really important**
Every time you'll run `npm install` inside a demo's folder, you must rebuild all with `npm run build:all`

# A. Cleanup and initialization
1. `npm install -g lite-server @angular/cli`
2. remove all `node_modules` and temp folders with compiled files (if necessary)
3. `npm install` (from the root of this project)
4. `npm run clean:all`
5. `cd examples/systemjs`
6. `npm install`
7. `cd ../..`
8. `cd examples/webpack`
9. `npm install`
10. `cd ../..`
11. `cd examples/angular-cli`
12. `npm install`
13. `cd ../../..`
14. `cd examples/universal`
15. `npm install`
16. `cd ../../..`
17. `npm run build:all`
18. `npm run docs` => try to open `./docs/index.html` with the `internal library documentation`
19. `npm run compodoc` => try to open `./documentation/index.html` with the `internal library documentation`

# B. Run systemjs example
1. `cd examples/systemjs`
2. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `cd ../..`

# C. Run webpack example
1. `cd examples/webpack`
2. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `npm run build:dev`
4. `cd dist && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ..`
6. `npm run build:prod`
7. `cd dist && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
8. `cd ..`
9. `npm run build:prod:aot` (if necessary re-follow all the steps from the beginning)
10. `cd dist && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
11. `cd ../../..`

# D. Run angular-cli example
1. `cd examples/angular-cli`
2. `npm run start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `ng build`
4. `cd dist && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ..`
6. `ng build --aot`
7. `cd dist && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
8. `cd ..`
9. `ng build --prod`
10. `cd dist && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
11. `cd ../../..`

# D. Run universal example
1. `cd examples/universal`
2. `npm run start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `npm run build:ssr && npm run serve:ssr` => if everything is ok (also in browser's console), kill the process and go to the next step
4. `npm run build:prerender && npm run serve:prerender` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ../../..`

# E. Create your pull request
1. **If it is ok, create your pull request specifying all the details**


TODO RESTORE THESE STEPS IN 5.x.x VERSIONS:<br>
-15. `npm test` => **IMPORTANT** if everything is ok, try to open `./coverage/html/index.html` with the `code coverage`-<br>
<br>
<br>
<br>
<br>


# Only for the author @Ks89 - How to publish this on npm?

## Stable releases (@latest)
1. `cd angular-modal-gallery`
2. `npm version patch` (x.x.1) or `npm version minor` (x.1.0) or `npm version major` (5.x.x)
3. `npm run clean:all`
4. `npm run build:lib`
5. `npm publish dist/angular-modal-gallery`
6. `git push origin master`
7. `git push origin vx.x.x`  <-- tag name created by npm version (for instance v5.0.1)

## Beta releases (@beta)
1. `cd angular-modal-gallery`
2. Manually change the version of `./angular-modal-gallery/package.json` with this format `x.x.x-beta.x` (also respect semver!)
3. `npm run clean:all`
4. `npm run build:lib`
5. `npm publish dist/angular-modal-gallery --tag beta`
6. `git push origin master`
7. `git push origin vx.x.x`  <-- tag name created by npm version (for instance v5.0.1)


## Alpha releases (@next)
1. `cd angular-modal-gallery`
2. Manually change the version of `./angular-modal-gallery/package.json` with this format `x.x.x-alpha.x` (also respect semver!)
3. `npm run clean:all`
4. `npm run build:lib`
5. `npm publish dist/angular-modal-gallery --tag next`
6. `git push origin master`
7. `git push origin vx.x.x`  <-- tag name created by npm version (for instance v5.0.1)

