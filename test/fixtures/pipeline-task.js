var mk = require('../../index');

function readme(cb) {
  doc('doc/readme.md')
    //.pipe(this.pi())
    //.pipe(this.msg())
    //.pipe(this.ref())
    .pipe(mk.out('target/pipeline-task.js'))
    .once('finish', cb);
}

mk.task(readme);
