var dependencies = require('./lib/dependencies');

exports.process = function process(name, id) {
  dependencies.create(name, id);
};

exports.list = function list() {
  return dependencies.list();
};

exports.validate = function validate() {
  return ['so', 'many', 'errors'];
};

exports.edit = function edit() {
  var validation = exports.validate();

  return validation;
};
