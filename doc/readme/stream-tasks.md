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

