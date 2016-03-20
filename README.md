# Task Runner

[![Build Status](https://travis-ci.org/mkdoc/mktask.svg?v=3)](https://travis-ci.org/mkdoc/mktask)
[![npm version](http://img.shields.io/npm/v/mktask.svg?v=3)](https://npmjs.org/package/mktask)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mktask/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mktask?branch=master)

> Run build tasks

Runs named task functions that return streams, arrays of deferred task functions or invoke the callback function.

## Install

```
npm i mktask --save
```

For the command line interface install [mkdoc][] globally (`npm i -g mkdoc`).

## Usage

Create a task file like this one ([source file](https://github.com/mkdoc/mktask/blob/master/mkdoc.js)):

```javascript
var mk = require('mktask');

// @task readme build the readme file.
function readme(cb) {
  mk.doc('doc/readme.md')         // read markdown source document
    .pipe(mk.pi())                // parse processing instructions
    .pipe(mk.msg())               // append generator message
    .pipe(mk.ref())               // include link references
    .pipe(mk.abs())               // make links absolute
    .pipe(mk.out())               // convert abstract syntax tree to markdown
    .pipe(mk.dest('README.md'))   // write the result to a file
    .on('finish', cb);            // proceed to next task
}

mk.task(readme);
```

And build README.md using:

```shell
mk
```

Or more explicitly:

```shell
mk readme
```

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

### Main Task

The `mk` program when executed with no arguments will either run all available tasks in series or if a `main` task is declared just run the main task. To declare a main task give it the name `main`:

```javascript
var mk = require('mktask');

// @task main build all documentation.
function main(cb) {
  // implement task logic
  cb();
}

mk.task(main);
```

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

Task functions may declare an array of functions to call before the task function(s).

Dependencies are executed in parallel but they must all complete before the tasks are executed:

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

## API

### mk

```javascript
mk()
```

Creates a task collection.

Returns a Task.

### #task

```javascript
static task()
```

Adds a task to the default task collection.

Returns a Task.

### Task

```javascript
Task()
```

Encapsulates a collection of named task functions.

### .task

```javascript
Task.prototype.task()
```

Adds task function(s) to the list of known tasks.

### .run

```javascript
Task.prototype.run()
```

Gets a task runner for this collection of tasks.

Returns a task Runner.

### #src

```javascript
static src()
```

Parses a markdown string into a stream.

Returns the output stream.

### #dest

```javascript
static dest([file])
```

Get a destination output stream.

If the file option is not given a destination stream that prints to
stdout is returned.

Returns an output stream.

* `file` String path to the output file.

### runner

```javascript
runner(opts)
```

Get a task runner.

Returns a Runner.

* `opts` Object processing options.

### Runner

```javascript
new Runner(opts)
```

Execute task functions.

* `opts` Object processing options.

#### Options

* `task` Object collection of tasks.

### .get

```javascript
Runner.prototype.get(id)
```

Get a task by name identifier.

Returns a task or undefined.

* `id` Function|String task identifier.

### .series

```javascript
Runner.prototype.series(list, cb)
```

Execute task functions in series.

* `list` Array of task functions.
* `cb` Function callback function.

### .parallel

```javascript
Runner.prototype.parallel(list[, concurrent], cb)
```

Execute task functions in parallel.

* `list` Array of task functions.
* `concurrent` Number number of concurrent calls.
* `cb` Function callback function.

### .exec

```javascript
Runner.prototype.exec(id, cb)
```

Execute a task by name identifier.

Dependencies are run in parallel before task execution.

Returns a task or undefined.

* `id` Function|String task identifier.
* `cb` Function callback function.

### .each

```javascript
Runner.prototype.each([names], cb)
```

Execute a list of tasks.

When `names` is not given and no main task exists all tasks are executed;
if a main task exists it is executed.

* `names` Array list of task identifiers or task functions.
* `cb` Function callback function.

## License

MIT

Generated by [mkdoc](https://github.com/mkdoc/mkdoc).

[mkdoc]: https://github.com/mkdoc/mkdoc
[mkparse]: https://github.com/mkdoc/mkparse
[commonmark]: http://commonmark.org
[npm]: https://www.npmjs.com
[github]: https://github.com
[jshint]: http://jshint.com
[jscs]: http://jscs.info

