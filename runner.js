var ast = require('mkast')
  , out = require('mkout')
  , MAIN = 'main';

/**
 *  Get a task runner.
 *
 *  @module {function} runner
 *  @param {Object} opts processing options.
 *
 *  @returns a Runner.
 */
function runner(opts) {
  return new Runner(opts);
}

/**
 *  Execute task functions.
 *
 *  @constructor Runner 
 *  @param {Object} opts processing options.
 *
 *  @option {Object} task collection of tasks.
 */
function Runner(task) {
  this.task = task;

  this.tasks = task.tasks;
  this.scope = task.scope || {};

  this.scope.ast = this.scope.ast || ast;
  this.scope.out = this.scope.out || out;
}

/**
 *  Get a task by name identifier.
 *
 *  @function get
 *  @member Runner
 *  @param {Function|String} id task identifier.
 *
 *  @returns a task or undefined.
 */
function get(id) {
  if(id instanceof Function) {
    id = id.name; 
  }
  for(var i = 0;i < this.tasks.length;i++) {
    if(id === this.tasks[i].id) {
      return this.tasks[i];
    } 
  }
}

/**
 *  Execute task functions in series.
 *
 *  @function series
 *  @member Runner
 *  @param {Array} list of task functions.
 *  @param {Function} cb callback function.
 */
function series(list, cb) {
  var items = list.slice(0)
    , runner = this
    , scope = this.scope
    , stream;

  function next(err) {
    if(err) {
      return cb(err); 
    }

    var item = items.shift();
    if(!item) {
      return cb(); 
    }

    var res = item.call(scope, next);

    // piping between stream return values
    if(res && res.pipe instanceof Function) {
      if(stream) {
        stream.pipe(res); 
      }
      stream = res;
      if(items.length) {
        // invoke callback manually on returned stream
        next();
      }else{
        res.once('finish', next);
      }
    // deferring to list of other tasks to execute
    }else if(Array.isArray(res)) {
      runner.each(res, next); 
    }
  }
  next();
}

/**
 *  Execute task functions in parallel.
 *
 *  @function parallel
 *  @member Runner
 *  @param {Array} list of task functions.
 *  @param {Number} [concurrent] number of concurrent calls.
 *  @param {Function} cb callback function.
 */
function parallel(list, concurrent, cb) {
  if(concurrent instanceof Function) {
    cb = concurrent;
    concurrent = 0;
  }

  var items = list.slice()
    , scope = this.scope
    , complete = 0;

  concurrent = concurrent || items.length;

  function run() {
    if(complete) {
      items = items.slice(concurrent);
    }
    for(var i = 0;i < concurrent;i++) {
      items[i].call(scope, next);
    }
  }

  function next(err) {
    if(err) {
      return cb(err); 
    }

    complete++;

    if(complete >= list.length) {
      return cb(); 
    }

    if(items.length && (complete % concurrent === 0)) {
      run(); 
    }
  }

  run();
}

/**
 *  Execute a task by name identifier.
 *
 *  Dependencies are run in parallel before task execution.
 *
 *  @function exec
 *  @member Runner
 *  @param {Function|String} id task identifier.
 *  @param {Function} cb callback function.
 *
 *  @returns a task or undefined.
 */
function exec(id, cb) {
  var task = this.get(id);

  if(!task) {
    throw new Error('task not found: ' + id); 
  }

  function onDependencies(err) {
    if(err) {
      return cb(err); 
    }
    this.series(task.tasks, cb);
  }

  if(task.deps.length) {
    this.parallel(task.deps, onDependencies.bind(this));
  }else{
    this.series(task.tasks, cb);
  }
  return task;
}

/**
 *  Execute a list of tasks to by string identifiers, when `names` is 
 *  not given all tasks are executed.
 *
 *  @function each
 *  @member Runner
 *
 *  @param {Array} [names] list of task names.
 *  @param {Function} cb callback function.
 */
function each(names, cb) {

  if(names instanceof Function) {
    cb = names;
    names = null;
  }

  if(!names) {
    // try to run the main function 
    if(this.get(MAIN)) {
      return this.exec(MAIN, cb);
    }

    names = this.tasks.map(function(task) {
      return task.id;
    }) 
  }

  var scope = this;
  names = names.slice();

  function next(err) {
    if(err) {
      return cb(err); 
    }
    var id = names.shift(); 
    if(id instanceof Function) {
      id = id.name; 
    }

    if(!id) {
      return cb(new Error('each() id is invalid: ' + id)); 
    }

    if(!scope.get(id)) {
      return cb(new Error('each() function ' + id + ' does not exist')); 
    }

    scope.exec(id, next);
  }
  next();
}

Runner.prototype.get = get;
Runner.prototype.exec = exec;
Runner.prototype.series = series;
Runner.prototype.parallel = parallel;
Runner.prototype.each = each;

//Runner.prototype.MAIN = MAIN;

module.exports = runner;
