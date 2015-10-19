'use strict';
/*jshint expr:true */

var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('stubs', function () {
  var module;
  var dependencies;
  var clock;

  beforeEach(function () {
    dependencies = {
      create: sinon.stub(),
      '@noCallThru': true
    };

    clock = sinon.useFakeTimers();

    module = proxyquire('./index', {
      './lib/dependencies': dependencies
    });
  });

  afterEach(function () {
    clock.restore();
  });

  describe('Fake timers', function () {
    it('will return the correct values for start, end and duration', function () {
      var callback = sinon.spy();

      module.process(callback);

      clock.tick(500);
      dependencies.create.callArg(0);

      expect(callback).calledOnce;
      expect(callback).calledWith({
        start: 0,
        end: 500,
        duration: 500
      });
    });
  });
});
