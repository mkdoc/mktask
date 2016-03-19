var mk = require('../../index');

function api(cb) {
  cb();
}

mk.task([api], function readme(cb) {
  cb();
})
