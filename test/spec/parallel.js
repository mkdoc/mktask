var expect = require('chai').expect
  , mktask = require('../../index');

describe('mktask:', function() {

  it('should exec task functions dependencies in parallel',
    function(done) {
      var mk = mktask()
        , called = 0
        , docsCalled
        , apiCalled
        , readmeCalled;

      function docs(cb) {
        called++;
        docsCalled = 1;
        cb();
      }

      function api(cb) {
        called++;
        apiCalled = 1;
        cb();
      }
      
      function readme(cb) {
        called++;
        readmeCalled = 1;
        cb();
      }
        
      mk.task([docs, api], readme);

      var runner = mk.run();
      runner.exec(readme, function() {
        expect(called).to.eql(3); 
        expect(docsCalled).to.eql(1); 
        expect(apiCalled).to.eql(1); 
        expect(readmeCalled).to.eql(1); 
        done();
      });
    }
  );

  it('should exec task functions dependencies in parallel w/ concurrent',
    function(done) {
      var mk = mktask()
        , called = 0
        , docsCalled
        , apiCalled
        , readmeCalled;

      function docs(cb) {
        called++;
        docsCalled = 1;
        cb();
      }

      function api(cb) {
        called++;
        apiCalled = 1;
        cb();
      }
      
      function readme(cb) {
        called++;
        readmeCalled = 1;
        cb();
      }
        
      mk.task([docs, api], readme);

      var runner = mk.run();
      runner.parallel([docs, api, readme], 1, function() {
        expect(called).to.eql(3); 
        expect(docsCalled).to.eql(1); 
        expect(apiCalled).to.eql(1); 
        expect(readmeCalled).to.eql(1); 
        done();
      });
    }
  );

});
