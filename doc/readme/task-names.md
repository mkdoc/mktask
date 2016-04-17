### Task Names

By default the task identifier (referenced on the command line) is taken from the function name but you may explicitly specify an identifier if you prefer:

```javascript
mk.task('docs', function readme(cb){cb()});
```

If you have dependencies the identifier comes afterwards:

```javascript
mk.task([api, example], 'docs', function readme(cb){cb()});
```

When multiple tasks are passed then the identifier is taken *from the last function* which in this case becomes `readme`:

```javascript
mk.task(function api(cb){cb()}, function readme(cb){cb()});
```

