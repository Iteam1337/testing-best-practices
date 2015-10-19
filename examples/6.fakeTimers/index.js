var dependencies = require('./lib/dependencies');

exports.process = function process(callback) {
  var start = Date.now();

  dependencies.create(function () {
    var end = Date.now();
    var duration = end - start;

    callback({
      duration: duration,
      start: start,
      end: end
    });
  });
};
