# Task Runner

[![Build Status](https://travis-ci.org/mkdoc/mktask.svg?v=3)](https://travis-ci.org/mkdoc/mktask)
[![npm version](http://img.shields.io/npm/v/mktask.svg?v=3)](https://npmjs.org/package/mktask)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mktask/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mktask?branch=master)

> Run build tasks

Runs named task functions that return streams.

## Install

```
npm i mktask --save
```

For the command line interface install [mkdoc][] globally (`npm i -g mkdoc`).

## API

### task

```javascript
task()
```

Creates a task collection.

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
Task.prototype.run([opts])
```

Gets a task runner for this collection of tasks.

Returns a task Runner.

* `opts` processing options.

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

* `list` Array of tasks.
* `scope` Object task execution scope.

### .get

```javascript
Runner.prototype.get(id)
```

Get a task by name identifier.

Returns a task or undefined.

* `id` Function|String task identifier.

### .exec

```javascript
Runner.prototype.exec(id)
```

Execute a task by name identifier.

Returns a task or undefined.

* `id` Function|String task identifier.

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

