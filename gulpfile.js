var gulp = require('gulp')
  , gulpIgnore = require('gulp-ignore')
  , concat = require('gulp-concat')
  , autoprefixer = require('gulp-autoprefixer')
  , wrap = require('gulp-wrap')
  , watch = require('gulp-watch')
  , streamqueue = require('streamqueue')
  , karma = require('karma').server
  , uglify = require('gulp-uglify')
  , minifyCSS = require('gulp-minify-css')
  , minifyHTML = require('gulp-minify-html')
  , runSequence = require('run-sequence')
  , env = process.env.NODE_ENV || 'DEV'
  , sass = require('gulp-sass')


gulp.task('config', function () {

  var srcConfig = ''

  console.log('App is running in ' + env + ' environment')

  if (env === 'PROD') {
    srcConfig = './config/prod.json'
  }
  else {
    srcConfig = './config/dev.json'
  }

  gulp
    .src(srcConfig)
    .pipe(concat('current.json'))
    .pipe(gulp.dest('./config'))
})

gulp.task('index.min.html', function () {
  var opts = {comments:true,spare:true};
  streamqueue(
    { objectMode: true }
    , gulp.src('blocks/**/*.html')
      .pipe(minifyHTML(opts))
      .pipe(gulp.dest('./dist/html'))
    , gulp.src(['blocks/**/*.css', 'libs/codemirror/lib/codemirror.css'])
      .pipe(minifyCSS({keepBreaks:false}))
      .pipe(gulp.dest('./dist/css'))
    , gulp.src(
      [ 'blocks/**/*.js'
      , 'libs/codemirror/lib/codemirror.js'
      , 'libs/share-codemirror/share-codemirror.js'
      , 'libs/codemirror/mode/javascript/javascript.js'
      ]
    )
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'))
    , gulp.src('dist/html/page/page.html')
    , gulp
      .src('dist/html/**/*.html')
      .pipe(gulpIgnore.exclude('**/page.html'))
      .pipe(wrap('<script '
          + 'type="template" '
          + 'id="<%= file.path.replace(/^.*\\/([^/]+)$/, \'$1\') %>">'
          + '<%= file.contents %>'
          + '</script>'
      ))
    , gulp
        .src(
          [ 'dist/css/codemirror.css'
          , 'dist/css/**/*.css'
          ]
        )
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
        , 'dist/js/codemirror.js'
        , 'node_modules/share/webclient/share.js'
        , 'dist/js/share-codemirror.js'
        , 'dist/js/javascript.js'
        , 'dist/js/page/page.js'
        , 'dist/js/**/*.js'
        ]
      )
      .pipe(concat('index.js'))
      .pipe(wrap('<script><%= contents %></script>'))
  )
    .pipe(concat('index.html'))
    .pipe(gulp.dest('./'))
})

gulp.task('index.html', function () {
  streamqueue(
    { objectMode: true }
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
        .src(
          [ 'libs/codemirror/lib/codemirror.css'
          , 'blocks/**/*.css'
          ]
        )
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
        , 'libs/codemirror/lib/codemirror.js'
        , 'node_modules/share/webclient/share.uncompressed.js'
        , 'libs/share-codemirror/share-codemirror.js'
        , 'libs/codemirror/mode/javascript/javascript.js'
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



gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done)
})

gulp.task('tdd', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done)
})

gulp.task('scripts', function () {
  gulp.src(
    [ 'libs/jquery/dist/jquery.js'
    , 'libs/lodash/dist/lodash.js'
    , 'libs/codemirror/lib/codemirror.js'
    , 'node_modules/share/webclient/share.uncompressed.js'
    , 'libs/share-codemirror/share-codemirror.js'
    , 'libs/codemirror/mode/javascript/javascript.js' // default language - javascript (temporarily)
    , 'public/blocks/page/page.js'
    , 'public/blocks/editor/editor.js'
    , 'public/blocks/page/socket.js'
    , 'public/blocks/sidebar/user.js'
    ]).pipe(concat('application.js'))
      .pipe(gulp.dest('public/build/'))
})

gulp.task('stylesheets', function () {
  gulp.src(
    [ 'libs/codemirror/lib/codemirror.css'
    , './public/build/index.css'
    ]).pipe(concat('application.css'))
      .pipe(gulp.dest('public/build/'))
})
//gulp.task('default', runSequence( 'config', 'index.html'))

gulp.task('sass', function () {
  gulp.src('./public/source/*.scss')
    .pipe(watch('./public/source/*.scss', function (files) {
      return files.pipe(sass())
        .pipe(autoprefixer('last 3 version', '> 5%', { cascade: true }))
        .pipe(gulp.dest('./public/build/'))
    }))
})

gulp.task('default', ['config', 'scripts', 'sass', 'stylesheets'])
gulp.task('nominify', ['config', 'index.html'])
