var dependencies = require('./lib/dependencies');
var Q = require('q');

exports.process = function process(name, id) {
  return dependencies
    .create(name)
    .then(function (doc) {
      doc.id = id;
      return doc;
    });
};

exports.edit = function edit(name) {
  return Q.Promise(function (resolve, reject) {
    resolve({
      id: 1337,
      name: name,
      herp: 'derp'
    });
  });
};

exports.create = function create(name) {
  return dependencies
    .validateDocument(name)
    .then(function () {
      return dependencies.createDocument(name);
    })
    .then(function (doc) {
      return dependencies.transformDocument(doc);
    })
    .then(function (result) {
      result.id = 1337;
      return result;
    })
    .catch(function () {
      throw 'something borked!';
    });
};

exports.list = function list(docs) {
  return Q.all(docs.map(function (doc) {
      return dependencies.create(doc);
    }))
    .then(function (results) {
      return {
        results: results,
        meta: {
          foo: 'bar'
        }
      };
    });
};
