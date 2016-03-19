var mk = require('../../index')
  , ast = require('mkast');

function api() {
  return mk.src('This is a markdown paragraph.')
    .pipe(ast.stringify());
}

function out() {
  return mk.dest('target/pipe-task.md');
}

mk.task(api, out);
