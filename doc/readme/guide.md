## Guide

### Creating Tasks

Tasks are *named* functions that are passed to the `task` function:

```javascript
var mk = require('mktask');

function readme(cb) {
  // implement task logic
  cb();
}

mk.task(readme);
```

Anonymous functions are not allowed and will generate an error if used.

Typically task functions will invoke the callback function when done but they may also return an array of task functions which is useful when a task wishes to defer to a series of other tasks:

```javascript
var mk = require('mktask');

function api(cb) {
  // implement api task logic
  cb();
}

function readme(cb) {
  // implement readme task logic
  cb();
}

function main() {
  return [api, readme];
}

mk.task(api);
mk.task(readme);
```
