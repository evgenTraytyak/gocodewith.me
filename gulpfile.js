var gulp = require('gulp')
  , watch = require('gulp-watch')
  , concat = require('gulp-concat')
  , autoprefixer = require('gulp-autoprefixer')
  , wrap = require('gulp-wrap')
  , streamqueue = require('streamqueue');

gulp.task('index.html', function () {
  streamqueue(
    { objectMode: true }
    , gulp.src(['blocks/page/page.html', 'blocks/**/*.html'])
    , gulp
        .src('blocks/**/*.css')
        .pipe(concat('index.css'))
        .pipe(autoprefixer(
          { browsers: ['last 3 versions']
          , cascade: true
          }
        ))
        .pipe(wrap('<style><%= contents %></style>'))
    , gulp
      .src('blocks/**/*.js')
      .pipe(concat('index.js'))
      .pipe(wrap('<script><%= contents %></script>'))
  )
    .pipe(concat('index.html'))
    .pipe(gulp.dest('./'))
})

gulp.task('watch', function () {
  watch([ 'blocks/**/*.html'
        , 'blocks/**/*.css'
        , 'blocks/**/*.js']
        , function () {
    gulp.start('index.html')
  });
});

gulp.task('default', ['index.html', 'watch'])
