var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should resolve task dependencies', function(done) {
    var mk = mktask()
      , called = 0;

    function dep(cb) {
      called++;
      cb(); 
    }

    function build(cb) {
      called++;
      cb(); 
    }
    
    function readme(cb) {
      called++;
      cb();
    }
      
    mk.task([dep], build);
    mk.task([build], readme);

    var runner = mk.run();
    runner.exec(readme, function() {
      expect(called).to.eql(3);
      done(); 
    });
  });

  it('should resolve task dependencies without duplication', function(done) {
    var mk = mktask()
      , called = 0;

    function dep(cb) {
      called++;
      cb(); 
    }

    function build(cb) {
      called++;
      cb(); 
    }
    
    function readme(cb) {
      called++;
      cb();
    }
      
    mk.task([dep], build);
    mk.task([dep, build], readme);

    var runner = mk.run();
    runner.exec(readme, function() {
      expect(called).to.eql(3);
      done(); 
    });
  });

});
