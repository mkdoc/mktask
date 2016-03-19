var runner = require('./runner')
  // default task collection for static access
  , tasks;

/**
 *  Creates a task collection.
 *
 *  @module {function} mk
 *
 *  @returns a Task.
 */
function mk(opts) {
  return new Task(opts);
}

/**
 *  Adds a task to the default task collection.
 *
 *  @static {function} task
 *
 *  @returns a Task.
 */
function task() {
  if(!tasks) {
    tasks = mk();
  }

  if(!arguments.length) {
    return tasks; 
  }

  return tasks.task.apply(tasks, arguments);
}

/**
 *  Encapsulates a collection of named task functions.
 *
 *  @function Task
 */
function Task() {
  this.tasks = [];
}

/**
 *  Adds task function(s) to the list of known tasks.
 *
 *  @function task
 *  @member Task
 */
function add() {
  var args = Array.prototype.slice.call(arguments)
    , i
    , func
    , map = {deps: [], tasks: [], id: null};

  function validate(func) {
    if(!(func instanceof Function)) {
      throw new TypeError('task expects function arguments');
    }

    if(!func.name) {
      throw new TypeError('task expects named functions');
    }
  }

  if(Array.isArray(args[0])) {
    map.deps = args.shift(); 
    map.deps.forEach(function(func) {
      validate(func);
    })
    if(typeof args[0] === 'string') {
      map.id = args.shift(); 
    }
  }else if(typeof args[0] === 'string') {
    map.id = args.shift(); 
  }

  if(!args.length) {
    throw new TypeError('task functions expected'); 
  }

  function gather(args) {
    for(i = 0;i < args.length;i++) {
      func = args[i];
      validate(func);

      // name is taken from first task function
      if(!map.id) {
        map.id = func.name; 
      }

      map.tasks.push(
        {task: func, name: func.name, arity: func.length});
    }
  }

  gather(args);
  this.tasks.push(map);
  return map;
}

/**
 *  Gets a task runner for this collection of tasks.
 *
 *  @function run
 *  @member Task
 *  @param [opts] processing options.
 *
 *  @returns a task Runner.
 */
function run(opts) {
  opts = opts || {};
  opts.tasks = this.tasks;
  return runner(opts);
}

Task.prototype.task = add;
Task.prototype.run = run;

mk.task = task;

module.exports = mk;
