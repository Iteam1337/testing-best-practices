var dependencies = require('./lib/dependencies');

exports.error = function error(payload) {
  if (payload) {
    return 'foo';
  }
  throw new Error('something borked!');
};

exports.stubError = function stubError(name) {
  return dependencies.create(name);
};
