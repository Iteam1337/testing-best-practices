'use strict';
/*jshint expr:true */

var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('callbacks', function () {
  var module;
  var dependencies;

  beforeEach(function () {
    dependencies = {
      create: sinon.stub(),
      on: sinon.stub(),
      '@noCallThru': true
    };

    module = proxyquire('./index', {
      './lib/dependencies': dependencies
    });
  });

  describe('callArg', function () {
    it('Invoke the callback of dependencies.create after we call the function we test', function () {
      var callback = sinon.spy();

      module.process('foo', 1337, callback);

      // Invoke the callback of dependencies.create after we initiated the function we test
      dependencies.create.callArg(2);

      expect(callback).calledOnce;
    });
  });

  describe('callArgWith', function () {
    it('Invokes the callback of dependencies.create after we call the function we test with specified arguments', function () {
      var callback = sinon.spy();

      module.process('foo', 1337, callback);

      // Invoke the callback of dependencies.create with specified arguments
      // This will invoke the callback of dependencies.create which will then
      // call the callback function passed to the module.process
      dependencies.create.callArgWith(2, 'herp', 100);

      expect(callback).calledWith('herp', 100);
    });
  });

  describe('callsArg', function () {
    it('Causes the callback of dependencies.create to be called', function () {
      var callback = sinon.spy();

      // Causes the callback of dependencies.create to be called
      dependencies.create.callsArg(2);

      module.process('foo', 1337, callback);

      expect(callback).calledOnce;
    });
  });

  describe('callsArgWith', function () {
    it('Causes the callback of dependencies.create to be called with specified arguments', function () {
      var callback = sinon.spy();

      // Causes the callback of dependencies.create to be called with specified arguments
      dependencies.create.callsArgWith(2, 'derp', 23);

      module.process('foo', 1337, callback);

      expect(callback).calledWith('derp', 23);
    });
  });

  describe('yield', function () {
    beforeEach(function () {
      dependencies.ready = sinon.spy();
    });

    it('Invokes callbacks passed to the spy with the given arguments', function () {
      var callback = sinon.spy();

      module.subscribe('foo', callback);

      // Invoke callbacks of dependencies.on
      dependencies.on.yield();

      expect(dependencies.ready, 'dependencies.ready').calledOnce;
      expect(callback, 'callback').calledOnce;
    });

    it('will invoke the callback for the specified arguments', function () {
      var callback = sinon.spy();

      module.subscribe('foo', callback);

      // Invoke callback of dependencies.on only when called with 'data'
      dependencies.on.withArgs('data').yield('herp');

      expect(dependencies.ready, 'dependencies.ready').not.called;
      expect(callback, 'callback').calledWith('herp');
    });
  });

  describe('yields', function () {
    beforeEach(function () {
      dependencies.ready = sinon.spy();
    });

    it('Causes the stub to call the first callback it receives with the given arguments', function () {
      var callback = sinon.spy();

      // Causes the stub to call the callback of dependencies.on
      dependencies.on.yields('herp');

      module.subscribe('foo', callback);

      expect(dependencies.ready, 'dependencies.ready').calledOnce;
      expect(callback, 'callback').calledWith('herp');
    });

    it('will invoke the callback for the specified arguments', function () {
      var callback = sinon.spy();

      // Causes the stub to call the callback of dependencies.on only when called with 'data'
      dependencies.on.withArgs('data').yields('herp');

      module.subscribe('foo', callback);

      expect(dependencies.ready, 'dependencies.ready').not.called;
      expect(callback, 'callback').calledWith('herp');
    });
  });
});
