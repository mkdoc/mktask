var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should create task', function(done) {
    var mk = mktask()
      , readme = function readme(){}
      , res = mk.task(readme);
    expect(res).to.be.an('object');
    expect(res.deps).to.eql([]);
    expect(res.tasks).to.be.an('array')
      .to.have.length(1);
    expect(res.id).to.eql(readme.name);
    expect(res.tasks[0]).to.equal(readme);
    done();
  });

  it('should create task w/ dependencies', function(done) {
    var mk = mktask()
      , api = function api(){}
      , readme = function readme(){}
      , res = mk.task([api], readme);
    expect(res).to.be.an('object');
    expect(res.deps).to.eql([api]);
    expect(res.tasks).to.be.an('array')
      .to.have.length(1);
    expect(res.id).to.eql(readme.name);
    expect(res.tasks[0]).to.equal(readme);
    done();
  });

  it('should create named task', function(done) {
    var mk = mktask()
      , name = 'docs'
      , readme = function readme(){}
      , res = mk.task(name, readme);
    expect(res).to.be.an('object');
    expect(res.deps).to.eql([]);
    expect(res.tasks).to.be.an('array')
      .to.have.length(1);
    expect(res.id).to.eql(name);
    done();
  });

  it('should create named task w/ dependencies', function(done) {
    var mk = mktask()
      , name = 'docs'
      , api = function api(){}
      , readme = function readme(){}
      , res = mk.task([api], name, readme);
    expect(res).to.be.an('object');
    expect(res.deps).to.eql([api]);
    expect(res.tasks).to.be.an('array')
      .to.have.length(1);
    expect(res.id).to.eql(name);
    done();
  });

  it('should error with no task functions', function(done) {
    var mk = mktask();
    function fn() {
      mk.task('foo');
    }
    expect(fn).throws(TypeError);
    done();
  });

  it('should error with anonymous task dependency function', function(done) {
    var mk = mktask()
      , readme = function(){}
    function fn() {
      mk.task([readme]);
    }
    expect(fn).throws(TypeError);
    done();
  });
  
  it('should error with anonymous task function', function(done) {
    var mk = mktask()
      , readme = function(){}
    function fn() {
      mk.task(readme);
    }
    expect(fn).throws(TypeError);
    done();
  });

  it('should error with non-function argument', function(done) {
    var mk = mktask();
    function fn() {
      mk.task(null);
    }
    expect(fn).throws(TypeError);
    done();
  });
  
});
