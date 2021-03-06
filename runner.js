var MAIN = 'main';

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
  if(typeof id === 'function') {
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

    var item = items.shift()
      , res;
    if(!item) {
      return cb(); 
    }

    try {
      res = item.call(scope, next);
    }catch(e) {
      return cb(e); 
    }

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
      try {
        items[i].call(scope, next);
      }catch(e) {
        return cb(e); 
      }
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
 *  Resolves dependencies for a task.
 *
 *  Searches for dependencies that are tasks and injects any dependencies for 
 *  located tasks.
 *
 *  @function resolve
 *  @member Runner
 *  @param {Function} cb callback function.
 *
 *  @returns an array of task dependencies.
 */
function resolve(deps) {
  var i
    , j
    , task
    , out = deps.slice();
  for(i = 0;i < deps.length;i++) {
    task = this.task.get(deps[i]);
    // dependency is a known task that has it's own dependencies
    if(task && task.deps && task.deps.length) {
      for(j = 0;j < task.deps.length;j++) {
        // do not duplicate if the dependency already exists
        if(!~out.indexOf(task.deps[j])) {
          if(!i) {
            out.unshift(task.deps[j]); 
          }else{
            out.splice(i, 0, task.deps[j])  
          }
        } 
      }
    }
  }
  return out;
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
    this.parallel(this.resolve(task.deps), onDependencies.bind(this));
  }else{
    this.series(task.tasks, cb);
  }
  return task;
}

/**
 *  Execute a list of tasks. 
 *
 *  When `names` is not given and no main task exists all tasks are executed; 
 *  if a main task exists it is executed.
 *
 *  @function each
 *  @member Runner
 *
 *  @param {Array} [names] list of task identifiers or task functions.
 *  @param {Function} cb callback function.
 */
function each(names, cb) {

  if(names instanceof Function) {
    cb = names;
    names = null;
  }

  if(!names || !names.length) {
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

    // all done
    if(id === undefined) {
      return cb(); 
    }

    if(typeof id === 'function') {
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
Runner.prototype.resolve = resolve;
Runner.prototype.exec = exec;
Runner.prototype.series = series;
Runner.prototype.parallel = parallel;
Runner.prototype.each = each;

module.exports = runner;
