'use strict';

var someModule = require('../lib/someModule');
var fs = require('fs');

exports.run = function run() {
  var result = someModule.process();
  return result;
};


exports.methodThatRequires = function methodThatRequires(path) {
  var modulePath = '/lib/' + path;
  return require(modulePath);
};

exports.readDirRequireCall = function readDirRequireCall(path) {
  return fs
    .readdirSync(path)
    .map(function (fileName) {
      // Recurse if directory
      if (fs.lstatSync(path + '/' + fileName).isDirectory()) {
        return exports.readDirRequireCall(path + '/' + fileName);
      } else {
        // Require the file.
        return require(path + '/' + fileName)();
      }
    });
};
