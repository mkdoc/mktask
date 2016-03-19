var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should iterate task function (each)', function(done) {
    var mk = mktask()
      , called = 0;
    
    function readme(cb) {
      called++;
      cb();
    }
      
    mk.task(readme);

    var runner = mk.run();
    runner.each([readme.name], function() {
      expect(called).to.eql(1);
      done();
    });
  });

  it('should iterate all task functions (each)', function(done) {
    var mk = mktask()
      , called = 0;

    function api(cb) {
      called++;
      cb();
    }
    
    function readme(cb) {
      called++;
      cb();
    }
      
    mk.task(api);
    mk.task(readme);

    var runner = mk.run();
    runner.each(function() {
      expect(called).to.eql(2);
      done();
    });
  });

});
