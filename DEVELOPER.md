Sometimes, shy developers have really good ideas. So don't be shy and open an issue! :)


If you want to help me, modify the source code, but **before to create a pull request, follow these steps**

**Attention! This is really important**
Every time you'll run `npm install` inside a demo's folder, you must rebuild the library with `npm run build`


1. `npm install -g lite-server @angular/cli` (on macOS use `sudo npm install -g lite-server @angular/cli`)
2. remove all `node_modules`, `.awt`, `aot` and `dist` folders in both `demo/systemjs`, `demo/webpack` and `demo/angular-cli` folders (if necessary)
3. `npm install` (from the root of this project)
4. `npm run clean:all`
5. `cd demo/systemjs`
6. `npm install`
7. `cd ../..`
8. `cd demo/webpack`
9. `npm install`
10. `cd ../..`
11. `cd demo/angular-cli/angular-modal-gallery-angularcli-demo`
12. `npm install`
13. `cd ../../..`
14. `npm run build`
15. `npm run test` => if everything is ok, go to the next step
16. `cd demo/systemjs`
17. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
18. `cd ../..`
19. `cd demo/webpack`
20. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
21. `npm run build:dev`
22. `cd dist`
23. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
24. `cd ..`
25. `npm run build:prod`
26. `cd dist`
27. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
28. `cd ..`
29. `npm run build:prod:aot` (if necessary re-follow all the steps from the beginning)
30. `cd dist`
31. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
32. `cd ../../..`
33. `cd demo/angular-cli/angular-modal-gallery-angularcli-demo`
34. `ng serve` => if everything is ok (also in browser's console), kill the process and go to the next step
35. `ng build`
36. `cd dist`
37. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
38. `cd ..`
39. `ng test` => if everything is ok, go to the next step
40. If it is ok, create your pull request.




-Only for the author-
how to publish this on npm

1. `npm version patch` (x.x.3) or `npm version minor` (x.3.0) or `npm version major` (3.x.x)
2. `npm run clean:all`
3. `npm run build`
4. `npm publish bundle`
5. `git push origin master`
6. `git push origin vx.x.x`  <-- tag name created by npm version (for instance v3.0.1)