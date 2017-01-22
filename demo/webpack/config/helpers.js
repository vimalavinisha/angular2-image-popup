'use strict';

const path = require('path');
const _root = path.resolve(__dirname, '..');
const root = (...args) => path.join.apply(path, [_root].concat(args));


const EVENT = process.env.npm_lifecycle_event || '';

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function hasNpmFlag(flag) {
  return EVENT.includes(flag);
}


exports.hasProcessFlag = hasProcessFlag;
exports.hasNpmFlag = hasNpmFlag;
exports.root = root;
