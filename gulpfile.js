var gulp = require('gulp')
  , concat = require('gulp-concat')
  , autoprefixer = require('gulp-autoprefixer')
  , watch = require('gulp-watch')
  , karma = require('karma').server
  , uglify = require('gulp-uglify')
  , minifyCSS = require('gulp-minify-css')
  , sass = require('gulp-sass')
  , env = process.env.NODE_ENV || 'DEV'


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

var scss_dev_dir = './public/source/'
  , scss_build_dir = './public/build/'
  , js_dev_dir = './public/blocks/**/'

gulp.task('sass', function () {
  gulp.src(scss_dev_dir + '*.scss')
    .pipe(sass())
    .pipe(autoprefixer('last 3 version', '> 5%', { cascade: true }))
    .pipe(gulp.dest(scss_build_dir))
})

gulp.task('watch', function () {
  gulp.watch(scss_dev_dir + '*.scss', ['sass'])
  gulp.watch(js_dev_dir + '*.js', ['scripts'])
})

gulp.task('default', ['config', 'scripts', 'sass', 'stylesheets', 'watch'])
