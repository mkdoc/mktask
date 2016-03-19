var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should get default task collection', function(done) {
    // static task() method
    var res = mktask.task();
    expect(res).to.be.an('object');
    done();
  });
  
});
