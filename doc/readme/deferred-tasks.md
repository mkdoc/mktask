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

