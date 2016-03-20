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
