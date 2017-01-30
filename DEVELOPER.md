Sometimes, shy developers have really good ideas. So don't be shy and open an issue! :)


If you want to help me, modify the source code, but before to create a pull request, follow these steps

1. `npm install -g lite-server` (on macOS use `sudo npm install -g lite-server`)
2. remove all `node_modules`, `.awt`, `aot` and `dist` folders in both `demo/systemjs` and `demo/webpack` folders
3. `npm install` (from the root of this project)
4. `npm run clean:all`
5. `cd demo/systemjs`
6. `npm install`
7. `cd ../..`
8. `cd demo/webpack`
9. `npm install`
10. `cd ../..`
11. `npm run build`
12. `cd demo/systemjs`
13. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
14. `cd ../..`
15. `cd demo/webpack`
16. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
17. `npm run build:dev`
18. `cd dist`
19. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
20. `cd ..`
21. `npm run build:prod`
22. `cd dist`
23. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
24. `cd ..`
25. `npm run build:prod:aot` (if necessary re-follow these steps: 4,8,9,10,11,15,25)
26. `cd dist`
27. `lite-server` => everything is ok (also in browser's console)? if yes go to the next step
28. `cd ..`
29. `npm run build:github:aot` => you can't try this, you only need to verify that the build process is ok
30. `npm test` (not mandatory at the moment, because it's still not implemented)
31. If it is ok, create your pull request.





-Only for the author-
how to publish this on npm

1. `npm version patch` (x.x.2) or `npm version minor` (x.2.0) or `npm version major` (2.x.x)
2. `npm run clean:all`
3. `npm run build`
4. `npm publish dist`
5. `npm push origin master`
6. `npm push origin vx.x.x`  <-- tag name created by npm version (for instance v2.0.2)