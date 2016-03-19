var tasks = [];

/**
 *  Task runner entry point.
 *
 *  @function Task
 */
function Task() {

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
    , map = {deps: [], tasks: [], name: null};

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
      map.name = args.shift(); 
    }
  }else if(typeof args[0] === 'string') {
    map.name = args.shift(); 
  }

  if(!args.length) {
    throw new TypeError('task functions expected'); 
  }

  function gather(args) {
    for(i = 0;i < args.length;i++) {
      func = args[i];
      validate(func);

      // name is taken from first task function
      if(!map.name) {
        map.name = func.name; 
      }

      map.tasks.push(
        {task: func, name: func.name, arity: func.length});
    }
  }

  gather(args);
  tasks.push(map);

  return map;
}

Task.prototype.task = task;

function mk(opts) {
  return new Task(opts);
}

module.exports = mk;
