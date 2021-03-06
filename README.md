# Task Runner

[![Build Status](https://travis-ci.org/mkdoc/mktask.svg?v=3)](https://travis-ci.org/mkdoc/mktask)
[![npm version](http://img.shields.io/npm/v/mktask.svg?v=3)](https://npmjs.org/package/mktask)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mktask/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mktask?branch=master)

> Run build tasks

Runs named task functions that return streams, arrays of deferred task functions or invoke the callback function.

## Install

Install the [mkdoc][] tools for the `mk` program:

```
npm i -g mkdoc
```

---

- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [Guide](#guide)
  - [Creating Tasks](#creating-tasks)
  - [Task Documentation](#task-documentation)
  - [Task Names](#task-names)
  - [Main Task](#main-task)
  - [Deferred Tasks](#deferred-tasks)
  - [Stream Tasks](#stream-tasks)
  - [Task Dependencies](#task-dependencies)
  - [Task Arguments](#task-arguments)
- [Sample](#sample)
- [Help](#help)
- [API](#api)
  - [mk](#mk)
  - [#task](#task)
  - [Task](#task-1)
  - [.task](#task-2)
  - [.get](#get)
  - [.run](#run)
  - [#src](#src)
  - [#dest](#dest)
  - [runner](#runner)
  - [Runner](#runner-1)
    - [Options](#options)
  - [.get](#get-1)
  - [.series](#series)
  - [.parallel](#parallel)
  - [.resolve](#resolve)
  - [.exec](#exec)
  - [.each](#each)
- [License](#license)

---

## Usage

Create a `mkdoc.js` task file like this one ([source file](https://github.com/mkdoc/mktask/blob/master/mkdoc.js)):

```javascript
var mk = require('mktask');

// @task readme build the readme file.
function readme(cb) {
  mk.doc('doc/readme.md')         // read markdown source document
    .pipe(mk.pi())                // parse processing instructions
    .pipe(mk.ref())               // include link references
    .pipe(mk.abs())               // make links absolute
    .pipe(mk.msg())               // append generator message
    .pipe(mk.toc({depth: 2}))     // inject table of contents list
    .pipe(mk.out())               // convert abstract syntax tree to markdown
    .pipe(mk.dest('README.md'))   // write the result to a file
    .on('finish', cb);            // proceed to next task
}

mk.task(readme);
```

Note that you **should not install** the `mktask` dependency, it is resolved by the command line program.

## Example

Build all tasks (or a main task when defined):

```shell
mk
```

Build specific tasks:

```shell
mk api readme
```

Use a specific build file:

```shell
mk -f ~/mkdoc.js readme
```

To see a list of tasks use:

```shell
mk --tasks
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

### Task Documentation

It is considered good practice to annotate your tasks with comments that provide a name and description of the task so that it will be included in the list printed when running `mk --tasks`.

```javascript
// @task readme build the readme file.
```

### Task Names

By default the task identifier (referenced on the command line) is taken from the function name but you may explicitly specify an identifier if you prefer:

```javascript
mk.task('docs', function readme(cb){cb()});
```

If you have dependencies the identifier comes afterwards:

```javascript
mk.task([api, example], 'docs', function readme(cb){cb()});
```

When multiple tasks are passed then the identifier is taken from the last function which in this case becomes `readme`:

```javascript
mk.task(function api(cb){cb()}, function readme(cb){cb()});
```

### Main Task

The `mk` program when executed with no arguments will either run all available tasks in series or a `main` task if declared. To declare a main task give it the name `main`:

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

### Task Arguments

Task functions are automatically exposed the parsed arguments object via `this.args` such that `mk readme --env devel` would result in the readme task being able to access the `env` option using `this.args.options.env`.

Flags are available in `this.args.flags` such that `mk readme -v` yields `true` for `this.args.flags.v`.

Note that some command line arguments are handled by the `mk` program you should take care that the names do not conflict.

For detailed information on the `args` object see the [argparse library][argparse].

## Sample

Inline code examples from the working example in [/doc/example](https://github.com/mkdoc/mktask/blob/master/doc/example).

The build file [mkdoc.js](https://github.com/mkdoc/mktask/blob/master/doc/example/mkdoc.js):

```javascript
var mk = require('../../index');

// @task example build the example file.
function example(cb) {
  mk.doc('source.md')             // read markdown source document
    .pipe(mk.pi())                // parse processing instructions
    .pipe(mk.ref())               // include link references
    .pipe(mk.out())               // convert abstract syntax tree to markdown
    .pipe(process.stdout)         // print the result
    .on('finish', cb);            // proceed to next task
}

mk.task(example);
```

The input source file [source.md](https://github.com/mkdoc/mktask/blob/master/doc/example/source.md):

```markdown
# Source

Example for the mk(1) program supplied by [mkdoc][].

A paragraph of markdown text followed by an include processing instruction.

<? @include include.md ?>

Followed by some more markdown content and the result of executing a shell command:

<? @exec uname ?>

Finally include the link definition file.

<? @include links.md ?>
```

Include file [include.md](https://github.com/mkdoc/mktask/blob/master/doc/example/include.md):

```markdown
## Include

A file that was included from another markdown document.
```

Include file [links.md](https://github.com/mkdoc/mktask/blob/master/doc/example/links.md):

```markdown
[mkdoc]: https://github.com/mkdoc/mkdoc
```

Result:

```markdown
# Source

Example for the mk(1) program supplied by [mkdoc][].

A paragraph of markdown text followed by an include processing instruction.

## Include

A file that was included from another markdown document.

Followed by some more markdown content and the result of executing a shell command:

Linux

Finally include the link definition file.

[mkdoc]: https://github.com/mkdoc/mkdoc

```

## Help

```
Usage: mk [-h] [--tasks] [--help] [--version] [--file=<file...>] [task...]

  Task runner.

Options
  -f, --file=[FILE...]    Load specific task files
  --tasks                 Print task list
  -h, --help              Display help and exit
  --version               Print the version and exit

mktask@1.3.10
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

### .get

```javascript
Task.prototype.get()
```

Get a task map by function reference.

Returns a task map if found.

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

### .resolve

```javascript
Runner.prototype.resolve(cb)
```

Resolves dependencies for a task.

Searches for dependencies that are tasks and injects any dependencies for
located tasks.

Returns an array of task dependencies.

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

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on May 22, 2016

[mkdoc]: https://github.com/mkdoc/mkdoc
[mkparse]: https://github.com/mkdoc/mkparse
[argparse]: https://github.com/cli-kit/cli-argparse
[commonmark]: http://commonmark.org
[npm]: https://www.npmjs.com
[github]: https://github.com
[jshint]: http://jshint.com
[jscs]: http://jscs.info

