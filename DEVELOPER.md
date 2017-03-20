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
15. `cd demo/systemjs`
16. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
17. `cd ../..`
18. `cd demo/webpack`
19. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
20. `npm run build:dev`
21. `cd dist`
22. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
23. `cd ..`
24. `npm run build:prod`
25. `cd dist`
26. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
27. `cd ..`
28. `npm run build:prod:aot` (if necessary re-follow all the steps from the beginning)
29. `cd dist`
30. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
31. `cd ../../..`
32. `cd demo/angular-cli/angular-modal-gallery-angularcli-demo`
33. `ng serve` => if everything is ok (also in browser's console), kill the process and go to the next step
34. `ng build`
35. `cd dist`
36. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
37. `cd ..`
38. `ng test` => if everything is ok, go to the next step
39. If it is ok, create your pull request.




-Only for the author-
how to publish this on npm

1. `npm version patch` (x.x.3) or `npm version minor` (x.3.0) or `npm version major` (3.x.x)
2. `npm run clean:all`
3. `npm run build`
4. `npm publish bundle`
5. `npm push origin master`
6. `npm push origin vx.x.x`  <-- tag name created by npm version (for instance v3.0.1)