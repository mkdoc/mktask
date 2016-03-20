## Guide

This guides assumes you are using the `mk` program to run tasks, install it with `npm i -g mkdoc`.

### Creating Tasks

Tasks are *named* functions that are passed to the `task` function:

```javascript
var mk = require('mktask');

// @task readme build the readme file.
function readme(cb) {
  // implement task logic
  cb();
}

mk.task(readme);
```

Anonymous functions are not allowed and will generate an error if used.

### Deferred Tasks

Typically task functions will invoke the callback function when done but they may also return an array of task functions which is useful when a task wishes to defer to a series of other tasks:

```javascript
var mk = require('mktask');

// @task api build the api docs.
function api(cb) {
  // implement api task logic
  cb();
}

// @task readme build the readme file.
function readme(cb) {
  // implement readme task logic
  cb();
}

// @task main build the api and readme docs.
function main() {
  return [api, readme];
}

mk.task(api);
mk.task(readme);
mk.task(main);
```

Note that when deferring to other task functions they must have been registered by calling `task()`.

### Stream Tasks

Sometimes when creating complex stream pipelines it is useful to return streams so that parts of the pipeline become reusable between tasks, for example:

```javascript
var mk = require('mktask')
  , ast = require('mkast');

function in() {
  return mk
    .src('This is a markdown paragraph.')
    .pipe(ast.stringify());
}

function out() {
  return mk.dest('target/stream-example.md');
}

mk.task(in, out);
```

When a task returns a stream it is piped to the next task function in the pipeline and the callback function is added as a listener for the `finish` event on the last stream in the pipeline.

### Task Dependencies

Task functions may declare an array of functions to call before the task function(s), dependencies are executed in parallel but they must all complete before the tasks are executed:

```javascript
var mk = require('mktask');

// @task api build the api docs.
function api(
  // implement api task logic
  cb();
}

// @task example build the example file.
function example(
  // implement example task logic
  cb();
}

// @task readme build the readme file.
function readme(cb) {
  // implement readme task logic
  cb();
}

mk.task([api, example], readme);
```
