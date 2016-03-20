var mk = require('./index');

// @task readme build the readme file.
function readme() {
  mk.doc('doc/readme.md')
    .pipe(mk.pi())
    .pipe(mk.msg())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.out())
    .pipe(mk.dest('README.md'));
}

mk.task(readme);
