var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should iterate deferred task functions (each)', function(done) {
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
      
    function main() {
      return [api, readme] 
    }

    mk.task(api);
    mk.task(readme);
    mk.task(main);

    var runner = mk.run();
    runner.each([main.name], function() {
      expect(called).to.eql(2);
      done();
    });
  });

});
