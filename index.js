var runner = require('./runner');

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
 */
function task() {
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
 *  @param [opts] processing options.
 *
 *  @returns a task Runner.
 */
function run(opts) {
  opts = opts || {};
  opts.tasks = this.tasks;
  return runner(opts);
}

Task.prototype.task = task;
Task.prototype.run = run;

/**
 *  Creates a task collection.
 *
 *  @function mk
 *
 *  @returns a Task.
 */
function mk(opts) {
  return new Task(opts);
}

module.exports = mk;
