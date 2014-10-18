var gulp = require('gulp')
  , gulpIgnore = require('gulp-ignore')
  , concat = require('gulp-concat')
  , autoprefixer = require('gulp-autoprefixer')
  , wrap = require('gulp-wrap')
  , streamqueue = require('streamqueue')

gulp.task('index.html', function () {
  streamqueue(
    { objectMode : true }
    , gulp.src('blocks/page/page.html')
    , gulp
      .src('blocks/**/*.html')
      .pipe(gulpIgnore.exclude('**/page.html'))
      .pipe(wrap('<script '
          + 'type="template" '
          + 'id="<%= file.path.replace(/^.*\\/([^/]+)$/, \'$1\') %>">'
          + '<%= file.contents %>'
          + '</script>'
      ))
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
      .src(
        [ 'libs/jquery/dist/jquery.min.js'
        , 'libs/lodash/dist/lodash.min.js'
        , 'libs/socket.io-client/socket.io.js'
        , 'blocks/page/page.js'
        , 'blocks/**/*.js'
        ]
      )
      .pipe(concat('index.js'))
      .pipe(wrap('<script><%= contents %></script>'))
  )
    .pipe(concat('index.html'))
    .pipe(gulp.dest('./'))
})

gulp.task('default', ['index.html'])