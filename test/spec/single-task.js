var expect = require('chai').expect
  , mktask = require('../../index')

require('../fixtures/single-task');

describe('mktask:', function() {

  it('should exec single task in file', function(done) {
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
