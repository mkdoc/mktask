var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should get file write destination stream', function(done) {
    var res = mktask.dest('target/foo.txt');
    expect(res).to.be.an('object');
    done();
  });
  
  it('should get default destination stream', function(done) {
    var res = mktask.dest();
    expect(res).to.be.an('object');
    done();
  });
  
});
