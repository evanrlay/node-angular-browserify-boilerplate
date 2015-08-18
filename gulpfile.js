var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");

gulp.task("bundle", function() {
  browserify("./app/main.js")
    .transform(babelify)
    .transform("brfs")
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./public"));
});

gulp.task("watch", function() {
  gulp.watch(["./app/*.js", "./app/components/**/*.js"], ["bundle"]);
});

gulp.task("default", ["bundle", "watch"]);