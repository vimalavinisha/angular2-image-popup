Sometimes, shy developers have really good ideas. So don't be shy and open an issue! :)


If you want to help me, modify the source code, but before to create a pull request, follow these steps

1. remove all `node_modules`, `.awt`, `aot` and `dist` folders in both the root folder, `demo/systemjs` and `demo/webpack`
2. `npm install`
3. `npm run cleanup`
4. `npm run build`
5. `cd demo/webpack`
6. `npm install`
7. `cd ../..`
8. `rm -rf demo/webpack/node_modules/angular-modal-gallery`
9. `cp -r dist/. demo/webpack/node_modules/angular-modal-gallery`
10. `cd demo/webpack`
11. `npm start` => if everything is ok, kill the process and go to the next step
12. `npm run build:dev`
13. `cd dist`
14. `lite-server` => everything is ok? if yes go to the next step
15. `cd ..`
16. `npm run build:prod`
17. `cd dist`
18. `lite-server` => everything is ok? if yes go to the next step
19. `cd ..`
20. `npm run build:prod:aot`
21. `cd dist`
22. `lite-server` => everything is ok? if yes go to the next step
23. `cd ..`
24. `npm run build:github:aot`
25. `npm test`
26. If it is ok, create your pull request.





-Only for the author-
how to publish this on npm

1. `npm version`
2. `npm publish dist`
3. `npm push origin master`
4. `npm push origin vx.x.x`  <-- tag name created by npm version