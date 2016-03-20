var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should callback with invalid task id error', function(done) {
    var mk = mktask();
    var runner = mk.run();

    runner.each([null], function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      done();
    });
  });

  it('should callback with missing task error', function(done) {
    var mk = mktask();

    function readme(cb) {
      cb();
    }

    // NOTE: have not called task()
      
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
