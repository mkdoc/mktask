var expect = require('chai').expect
  , mktask = require('../../index')

describe('mktask:', function() {

  it('should exec tasks and pipe streams', function(done) {

    mktask.clear();
    require('../fixtures/pipe-task');

    var mk = mktask.task();
    var runner = mk.run();
    expect(mk).to.be.an('object');
    expect(mk.tasks).to.be.an('array')
      .to.have.length(1);
    runner.exec('api', function() {
      done();
    });
  });

});
