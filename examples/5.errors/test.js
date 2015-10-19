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

  beforeEach(function () {
    dependencies = {
      '@noCallThru': true
    };

    module = proxyquire('./index', {
      './lib/dependencies': dependencies
    });
  });

  describe('Errors', function () {
    describe('#error', function () {
      it('tests that it throws', function () {
        // Will invoke module.error automatically
        expect(module.error).to.throw('something borked!');
      });

      it('can bind arguments to test it does not throw', function () {
        expect(module.error.bind(null, 'herp derp')).to.not.throw(Error);
      });
    });

    describe('#stub errors', function () {
      beforeEach(function () {
        dependencies.create = sinon.stub();
      });
      it('will throw for specific arguments', function () {
        dependencies.create.withArgs('foo').throws('TypeError');
        dependencies.create.returns('hello world');

        expect(module.stubError).to.not.throw(Error);
        expect(module.stubError()).to.eql('hello world');

        expect(module.stubError.bind(null, 'foo')).to.throw(Error);
      });
    });
  });
});
