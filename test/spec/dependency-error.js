var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should callback with dependency error', function(done) {
    var mk = mktask();

    function api(cb) {
      cb(new Error('mock error')); 
    }
    
    function readme(cb) {
      cb();
    }
      
    mk.task([api], readme);

    var runner = mk.run();
    runner.each([readme.name], function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      done();
    });
  });
});
