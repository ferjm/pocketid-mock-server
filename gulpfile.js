var gulp    = require('gulp');
var server  = require('./app.js');

gulp.task('default', function() {
  server.run();
});
