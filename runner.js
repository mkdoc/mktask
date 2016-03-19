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
 *  @option {Array} list of tasks.
 *  @option {Object} scope task execution scope.
 */
function Runner(opts) {
  this.tasks = opts.tasks;
  this.scope = opts.scope || {};
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
    , scope = this.scope;

  function next(err) {
    if(err) {
      return cb(err); 
    }

    var item = items.shift();
    if(!item) {
      return cb(); 
    }

    item.task.call(scope, next);
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
    for(var i = 0;i < concurrent;i++) {
      items[i].call(scope, next);
    }
    items = items.slice(concurrent);
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

Runner.prototype.get = get;
Runner.prototype.exec = exec;
Runner.prototype.series = series;
Runner.prototype.parallel = parallel;

module.exports = runner;
