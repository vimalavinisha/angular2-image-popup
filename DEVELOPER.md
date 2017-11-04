Sometimes, shy developers have really good ideas. So don't be shy and open an issue! :)


If you want to help me, modify the source code, but **before to create a pull request, follow these steps**

**Attention! This is really important**
Every time you'll run `npm install` inside a demo's folder, you must rebuild the library with `npm run build`


1. `npm install -g lite-server @angular/cli` (on macOS use `sudo npm install -g lite-server @angular/cli`)
2. remove all `node_modules`, `.awt`, `aot` and `dist` folders everywhere, also in both `demo/systemjs`, `demo/webpack` and `demo/angular-cli` folders (if necessary)
3. `npm install` (from the root of this project)
4. `npm run clean:all`
5. `cd demo/systemjs`
6. `npm install`
7. `cd ../..`
8. `cd demo/webpack`
9. `npm install`
10. `cd ../..`
11. `cd demo/angular-cli`
12. `npm install`
13. `cd ../../..`
14. `npm run build:lib`
17. `npm run compodoc` => try to open `./documentation/index.html` with the `internal library documentation`
18. `cd demo/systemjs`
19. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
20. `cd ../..`
21. `cd demo/webpack`
22. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
23. `npm run build:dev`
24. `cd dist`
25. `lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
26. `cd ..`
27. `npm run build:prod`
28. `cd dist`
29. `lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
30. `cd ..`
31. `npm run build:prod:aot` (if necessary re-follow all the steps from the beginning)
32. `cd dist`
33. `lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
34. `cd ../../..`
35. `cd demo/angular-cli`
36. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
37. `npm run build`
38. `cd dist`
39. `lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
40. `cd ..`
41. **If it is ok, create your pull request**

TODO RESTORE THESE STEPS IN 4.x.x VERSIONS:<br>
-15. `npm test` => **IMPORTANT** if everything is ok, try to open `./coverage/html/index.html` with the `code coverage`-<br>
-16. `npm run docs` => try to open `./docs/index.html` with the `internal library documentation`-
<br>
<br>
<br>
<br>

# Only for the author @Ks89 - How to publish this on npm?

## Stable releases (@latest)
1. `cd angular-modal-gallery`
2. `npm version patch` (x.x.1) or `npm version minor` (x.1.0) or `npm version major` (4.x.x)
3. `npm run clean:all`
4. `npm run build:lib`
5. `npm publish dist/angular-modal-gallery`
6. `git push origin master`
7. `git push origin vx.x.x`  <-- tag name created by npm version (for instance v4.0.1)

## Beta releases (@beta)
1. `cd angular-modal-gallery`
2. Manually change the version of `./angular-modal-gallery/package.json` with this format `x.x.x-beta.x` (also respect semver!)
3. `npm run clean:all`
4. `npm run build:lib`
5. `npm publish dist/angular-modal-gallery --tag beta`
6. `git push origin master`
7. `git push origin vx.x.x`  <-- tag name created by npm version (for instance v4.0.1)


## Alpha releases (@next)
1. `cd angular-modal-gallery`
2. Manually change the version of `./angular-modal-gallery/package.json` with this format `x.x.x-alpha.x` (also respect semver!)
3. `npm run clean:all`
4. `npm run build:lib`
5. `npm publish dist/angular-modal-gallery --tag next`
6. `git push origin master`
7. `git push origin vx.x.x`  <-- tag name created by npm version (for instance v4.0.1)

