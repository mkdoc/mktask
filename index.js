var fs = require('fs')
  , ast = require('mkast')
  , runner = require('./runner')
  // default task collection for static access
  , tasks = null;

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
function Task(opts) {
  opts = opts || {};
  this.tasks = [];
  this.scope = opts.scope;
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
    // NOTE: must not use instanceof here as task files
    // NOTE: are run as scripts in a vm context
    if(typeof func !== 'function') {
      throw new TypeError('task() expects function arguments');
    }

    if(!func.name) {
      throw new TypeError('task() expects named functions');
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
    throw new TypeError('not enough arguments for task()'); 
  }

  function gather(args) {
    for(i = 0;i < args.length;i++) {
      func = args[i];
      validate(func);

      // name is taken from first task function
      if(!map.id && i === args.length - 1) {
        map.id = func.name; 
      }

      map.tasks.push(func);
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
 *
 *  @returns a task Runner.
 */
function run() {
  var res = runner(this);

  // run from array of tasks passed to this function
  if(arguments.length) {
    res.each.apply(res, arguments);
  }

  return res;
}

Task.prototype.task = add;
Task.prototype.run = run;

/**
 *  Parses a markdown string into a stream.
 *
 *  @static {function} src
 *
 *  @returns the output stream.
 */
mk.src = ast.src;

/**
 *  Get a destination output stream.
 *
 *  If the file option is not given a destination stream that prints to 
 *  stdout is returned.
 *
 *  @static {function} dest
 *  @param {String} [file] path to the output file.
 *  
 *  @returns an output stream.
 */
function dest(file) {
  var output = process.stdout;
  if(typeof file === 'string') {
    output = fs.createWriteStream(file);  
  }
  return output;
}

mk.dest = dest;
mk.task = task;

/**
 *  Clear the static collection of tasks.
 *
 *  Used primarily for the test specs.
 *
 *  @private
 */
function clear(opts) {
  tasks = mk(opts);
}

mk.clear = clear;
mk.run = function() {
  if(tasks) {
    return tasks.run.apply(tasks, arguments);
  }
}

module.exports = mk;
