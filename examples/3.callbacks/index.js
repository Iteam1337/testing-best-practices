var dependencies = require('./lib/dependencies');

exports.process = function process(name, id, callback) {
  dependencies.create(name, id, function (document, time) {
    callback(document, time);
  });
};

exports.subscribe = function subscribe(name, callback) {
  dependencies.on('ready', function () {
    dependencies.ready();
  });

  dependencies.on('data', function (payload) {
    callback(payload);
  });
};
