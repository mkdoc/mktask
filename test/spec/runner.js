var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should get task from runner', function(done) {
    var mk = mktask()
      , readme = function readme(){}
      , res = mk.task(readme)
      , runner = mk.run();

    expect(res).to.be.an('object');
    expect(runner).to.be.an('object');

    expect(runner.get(readme)).to.eql(res);
    expect(runner.get(readme.name)).to.eql(res);

    expect(runner.get('foo')).to.eql(undefined);

    done();
  });

});
