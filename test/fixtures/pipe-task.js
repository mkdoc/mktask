var mk = require('../../index');

function api() {
  return mk.src('This is a markdown paragraph.')
}

function out() {
  return mk.dest('target/pipe-task.md');
}

mk.task(api, out);
