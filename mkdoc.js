var mk = require('./index');

// @task readme build the readme file.
function readme() {
  mk.doc('doc/readme.md')         // read markdown source document
    .pipe(mk.pi())                // parse processing instructions
    .pipe(mk.msg())               // append generator message
    .pipe(mk.ref())               // include link references
    .pipe(mk.abs())               // make links absolute
    .pipe(mk.out())               // convert abstract syntax tree to markdown
    .pipe(mk.dest('README.md'));  // write the result to a file
}

mk.task(readme);
