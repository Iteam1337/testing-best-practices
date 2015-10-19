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

  describe('spies', function () {
    beforeEach(function () {
      dependencies.create = sinon.spy();
    });

    describe('#process', function () {
      it('calls the dependencies.create method', function () {
        module.process();
        expect(dependencies.create).calledOnce;
      });

      it('calls the dependencies create method with the correct parameters', function () {
        module.process('foo', 1337);

        // Test the call data the easy way
        expect(dependencies.create).calledWith('foo', 1337);

        // Get arguments
        var args = dependencies.create.firstCall.args;

        expect(args[0]).to.eq('foo');
        expect(args[1]).to.eq(1337);
      });

      it('always calls the create method with the correct parameters', function () {
        module.process('abc', 1);
        module.process('acd', 2);
        module.process('ade', 3);
        module.process('aef', 4);

        // Get the call count of a spy/stub
        expect(dependencies.create.callCount).to.eq(4);

        // Get a specific call of a spy/stub
        expect(dependencies.create.firstCall, 'firstCall').calledWith('abc', 1);
        expect(dependencies.create.secondCall, 'secondCall').calledWith('acd', 2);
        expect(dependencies.create.thirdCall, 'thirdCall').calledWith('ade', 3);
        expect(dependencies.create.getCall(3), 'fourthCall').calledWith('aef', 4);
      });
    });
  });

  describe('stubs', function () {
    beforeEach(function () {
      // Create an anonymous stub function
      dependencies.list = sinon.stub();
    });

    describe('#list', function () {
      it('should return a list when we mock what the stub returns', function () {
        var docs = [1, 2, 3];

        // Make the stub return the provided value
        dependencies.list.returns(docs);

        var result = module.list();

        expect(result).to.eql([1, 2, 3]);
      });

      it('should return undefined otherwise', function () {
        var result = module.list();

        expect(result).to.be.undefined;
      });
    });

    describe('#edit', function () {
      it('will return a correct result after we mock a module function', function () {
        // Replace module.method with a stub function
        sinon.stub(module, 'validate').returns('herp derp');

        var result = module.edit('foo');

        expect(result).to.eq('herp derp');

        // Restore the original function
        module.validate.restore();
      });
    });

    describe('#validate', function () {
      it('returns the correct value even though it was stubbed before', function () {
        var result = module.validate();

        expect(result).to.eql(['so', 'many', 'errors']);
      });
    });
  });
});
