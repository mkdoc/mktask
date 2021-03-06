var expect = require('chai').expect
  , mktask = require('../../index')

describe('mktask:', function() {

  it('should exec single task in file', function(done) {

    mktask.clear();
    require('../fixtures/single-task');

    var mk = mktask.task();
    var runner = mk.run();
    expect(mk).to.be.an('object');
    expect(mk.tasks).to.be.an('array')
      .to.have.length(1);
    runner.exec('readme', function() {
      done();
    });
  });

});
