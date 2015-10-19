'use strict';
/*jshint expr:true */

var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('dependencies', function () {
  var module;
  var someModule;
  var fakeModule;
  var fooModule;
  var herpModule;
  var derpModule;
  var fs;

  beforeEach(function () {
    someModule = {
      process: function () {
        return 1337;
      },
      '@noCallThru': true //  stub out module that doesn't even exist on the machine
    };

    fakeModule = {
      foo: 'bar',
      herp: 'derp',
      '@noCallThru': true //  stub out module that doesn't even exist on the machine
    };

    fs = {
      readdirSync: sinon.stub(),
      lstatSync: sinon.stub(),
      isDirectory: sinon.stub()
    };

    fooModule = sinon.stub();
    fooModule['@noCallThru'] = true;

    herpModule = sinon.stub();
    herpModule['@noCallThru'] = true;

    derpModule = sinon.stub();
    derpModule['@noCallThru'] = true;

    // Proxies nodejs's require in order to make overriding dependencies
    module = proxyquire('./index', {
      '../lib/someModule': someModule,
      '/lib/fakeModule': fakeModule,
      '/lib/foo.js': fooModule,
      'root/lib/herp.js': herpModule,
      'root/derp.js': derpModule,
      fs: fs
    });
  });

  it('can stub out modules that don\'t even exist', function () {
    var result = module.run();
    expect(result).to.eq(1337);
  });

  it('can test a require function', function () {
    var result = module.methodThatRequires('fakeModule');

    expect(result).to.eq(fakeModule);
  });

  describe('#readDirRequireCall', function () {
    it('will require a file if not a directory', function () {
      var contents = ['foo.js'];

      // Mock what foo module returns
      fooModule.returns('foo');

      // Mock read dir to return a file
      fs.readdirSync.returns(contents);

      // Mock fs lstatSync to return fs itself (don't know the implementation of it)
      fs.lstatSync.returns(fs);

      // Mock fs.isDirectory to return false
      fs.isDirectory.returns(false);

      var result = module.readDirRequireCall('/lib');

      // since we return an array and we mocked what require returns
      expect(result).to.eql(['foo']);
    });

    it('will require the contents of a directory', function () {
      var rootContents = ['lib', 'derp.js'];
      var herpContents = ['herp.js'];
      var derpContens = ['derp.js'];

      // Mock what herp module returns
      herpModule.returns('herp');

      // Mock what derp module returns
      derpModule.returns('derp');

      // Mock read dir to return a directory for root
      fs.readdirSync.withArgs('root').returns(rootContents);

      // Mock read dir to return the correct contents for root/lib directory
      fs.readdirSync.withArgs('root/lib').returns(herpContents);

      // Mock read dir to return the correct contents for root/derp.js file
      fs.readdirSync.withArgs('root/derp.js').returns(derpContens);

      // Mock fs lstatSync to return fs itself (don't know the implementation of it)
      fs.lstatSync.returns(fs);

      // Mock fs.isDirectory to return true for the first call (so that we test the recursive part)
      fs.isDirectory.onCall(0).returns(true);

      // Mock fs.isDirectory to return false for the rest of the calls
      fs.isDirectory.returns(false);

      var result = module.readDirRequireCall('root');

      // since we return an array and we mocked what require returns
      expect(result).to.eql([
        ['herp'], 'derp'
      ]);
    });
  });
});
