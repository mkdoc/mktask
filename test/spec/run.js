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

  it('should return task from runner (exec)', function(done) {
    var mk = mktask()
      , readme = function readme(){}
      , res = mk.task(readme)
      , runner = mk.run()
      , task = runner.exec(readme, function noop(){});

    expect(res).to.be.an('object');
    expect(task).to.be.an('object');

    done();
  });

  it('should error on task not found (exec)', function(done) {
    var mk = mktask()
      , readme = function readme(){};
    
    mk.task(readme);
    var runner = mk.run();

    function fn() {
      runner.exec('foo');
    }

    expect(fn).throws(Error);

    done();
  });

  it('should exec task function', function(done) {
    var mk = mktask()
    
    function readme(cb) {
      cb();
    }
      
    mk.task(readme);

    var runner = mk.run();
    runner.exec(readme, done);
  });

  it('should exec multiple task functions in series', function(done) {
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
      
    mk.task(api, readme);

    var runner = mk.run();
    runner.exec(api, function() {
      expect(called).to.eql(2); 
      done();
    });
  });


  it('should callback with error on task function exec', function(done) {
    var mk = mktask()
    
    function readme(cb) {
      cb(new Error('mock readme error'));
    }
      
    mk.task(readme);

    var runner = mk.run();
    runner.exec(readme, function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(Error);
      done();
    });
  });


});
