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
 *  Execute a task by name identifier.
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

  this.series(task.tasks, cb);

  return task;
}

Runner.prototype.get = get;
Runner.prototype.exec = exec;
Runner.prototype.series = series;

module.exports = runner;
