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

