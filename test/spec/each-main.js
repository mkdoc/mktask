var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should run main function (each)', function(done) {
    var mk = mktask()
      , called = 0;
    
    function main(cb) {
      called++;
      cb();
    }
      
    mk.task(main);

    var runner = mk.run();
    runner.each(function() {
      expect(called).to.eql(1);
      done();
    });
  });

});
