/**
 *  Get a task runner.
 *
 *  @module {function} run
 *  @param {Object} opts processing options.
 *
 *  @returns a Runner.
 */
function run(opts) {
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
 *  Execute a task by name identifier.
 *
 *  @function exec
 *  @member Runner
 *  @param {Function|String} id task identifier.
 *
 *  @returns a task or undefined.
 */
function exec(id) {
  var task = this.get(id)
    //, deps = task.deps
    //, tasks = task.tasks;

  if(!task) {
    throw new Error('task not found: ' + id); 
  }

  return task;
}

Runner.prototype.get = get;
Runner.prototype.exec = exec;

module.exports = run;
