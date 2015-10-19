'use strict';
/*jshint expr:true */

var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var sinonPromise = require('sinon-promise');

chai.use(require('sinon-chai'));

describe('stubs', function () {
  var module;
  var dependencies;

  before(function () {
    sinonPromise(sinon);
  });

  /**
   * With sinon-promise 0.0.2 we need to restore sinon
  after(function () {
    sinonPromise.restore();
  });
  */

  beforeEach(function () {
    dependencies = {
      create: sinon.promise(),
      '@noCallThru': true
    };

    module = proxyquire('./index', {
      './lib/dependencies': dependencies,
      q: sinonPromise.Q // this is required only with sinon-promise version > 0.1.0
    });
  });

  describe('promises', function () {
    it('will create a document', function () {
      module.process('foo', 1337);

      expect(dependencies.create).calledOnce;
      expect(dependencies.create).calledWith('foo');
    });

    it('will return a document when the promise is resolved', function () {
      var success = sinon.spy();
      var doc = {
        herp: 'derp'
      };

      module
        .process('foo', 1337)
        .then(success);

      // Resolve the dependencies.create promise
      dependencies.create.resolve(doc);

      expect(success).calledOnce;
      expect(success).calledWith({
        herp: 'derp',
        id: 1337
      });
    });
  });

  describe('q promises', function () {
    it('will return a document when the promise is resolved', function () {
      var success = sinon.spy();

      module
        .edit('foo')
        .then(success);

      expect(success).calledOnce;
      expect(success).calledWith({
        herp: 'derp',
        name: 'foo',
        id: 1337
      });
    });
  });

  describe('chaining more promises', function () {
    beforeEach(function () {
      dependencies.validateDocument = sinon.promise();
      dependencies.createDocument = sinon.promise();
      dependencies.transformDocument = sinon.promise();
    });

    it('will first validate the name', function () {
      module.create('foo');

      expect(dependencies.validateDocument).calledOnce;
      expect(dependencies.validateDocument).calledWith('foo');
    });

    it('then creates a document', function () {
      module.create('foo');

      // We resolve the validateDocument promise
      dependencies.validateDocument.resolve();

      expect(dependencies.createDocument).calledOnce;
      expect(dependencies.createDocument).calledWith('foo');
    });

    it('then transforms the document into something pretty', function () {
      var doc = {};

      module.create('foo');

      // Resolve the validateDocument promise
      dependencies.validateDocument.resolve();

      // Resolve the createDocument promise
      dependencies.createDocument.resolve(doc);

      expect(dependencies.transformDocument).calledOnce;
      expect(dependencies.transformDocument).calledWith(doc);
    });

    it('then adds extra information and returns the result', function () {
      var doc = {};

      var transformedDoc = {
        herp: 'derp'
      };

      var result = {
        herp: 'derp',
        id: 1337
      };

      var success = sinon.spy();

      module
        .create('foo')
        .then(success);

      // Resolve the validateDocument promise
      dependencies.validateDocument.resolve();

      // Resolve the createDocument promise
      dependencies.createDocument.resolve(doc);

      // Resolve the transformDocument promise
      dependencies.transformDocument.resolve(transformedDoc);

      expect(success).calledOnce;
      expect(success).calledWith(result);
    });

    it('rejects the promise if something goes wrong along the way', function () {
      var doc = {};

      var transformedDoc = {
        herp: 'derp'
      };

      var success = sinon.spy();
      var fail = sinon.spy();

      module
        .create('foo')
        .then(success)
        .catch(fail);

      // Resolve the validateDocument promise
      dependencies.validateDocument.resolve();

      // Reject the createDocument promise
      dependencies.createDocument.reject();

      expect(success).not.called;

      expect(fail).calledOnce;
      expect(fail).calledWith('something borked!');
    });
  });

  describe('resolving multiple promises', function () {
    it('will create a record for each document passed', function () {
      var docs = [{}, {}, {}];

      module.list(docs);

      expect(dependencies.create).calledThrice;
    });

    it('then returns a pretty result when all documents are created', function () {
      var docs = [{}, {}];

      var firstDoc = {
        id: 1,
        name: 'first'
      };

      var secondDoc = {
        id: 2,
        name: 'second'
      };

      var result = {
        results: [firstDoc, secondDoc],
        meta: {
          foo: 'bar'
        }
      };

      var success = sinon.spy();

      module
        .list(docs)
        .then(success);

      // Resolve the first create promise
      dependencies.create.firstCall.resolve(firstDoc);

      // Resolve the second create promise
      dependencies.create.secondCall.resolve(secondDoc);

      expect(success).calledOnce;
      expect(success).calledWith(result);
    });
  });
});
