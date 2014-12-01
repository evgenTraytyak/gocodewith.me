var gulp = require('gulp')
  , uglify = require('gulp-uglify')
  , minifyCSS = require('gulp-minify-css')
  , sass = require('gulp-sass')
  , plugins = require('gulp-load-plugins')()
  , env = process.env.NODE_ENV || 'DEV'

var dir = {}
  dir._ = './public/'
  dir.dev = {}
    dir.dev._ = dir._ + 'source/'
    dir.dev.scss = dir.dev._ + '*.scss'
    dir.dev.js = dir._ + 'blocks/**/*.js'
  dir.build = {}
    dir.build._ = dir._ + 'build/'

// Frontend builder
gulp.task('config', function () {
  var srcConfig = ''

  if (env === 'production') {
    srcConfig = './config/prod.json'
  }
  else {
    srcConfig = './config/dev.json'
  }

  gulp
    .src(srcConfig)
    .pipe( plugins.concat('current.json') )
    .pipe( gulp.dest('./config') )

})

gulp.task('scripts', function () {
  gulp
    .src(
      [ 'libs/jquery/dist/jquery.js'
      , 'libs/lodash/dist/lodash.js'
      , 'libs/codemirror/lib/codemirror.js'
      , 'node_modules/share/webclient/share.uncompressed.js'
      , 'libs/share-codemirror/share-codemirror.js'
      , 'public/blocks/page/page.js'
      , 'public/blocks/editor/editor.js'
      , 'public/blocks/page/socket.js'
      , 'public/blocks/sidebar/user.js'
      ])
    .pipe( plugins.concat('application.js') )
    .pipe( gulp.dest(dir.build._) )
})

gulp.task('sass', function() {
  gulp
    .src(dir.dev.scss)
    .pipe( plugins.sass() )
    .pipe( plugins.autoprefixer('last 3 version', '> 5%', { cascade: true }) )
    .pipe( gulp.dest(dir.build._) )
})

gulp.task('stylesheets', function() {
  gulp
    .src(
      [ 'libs/codemirror/lib/codemirror.css'
      , './public/build/index.css'
      ])
    .pipe( plugins.concat('application.css') )
    .pipe( gulp.dest(dir.build._) )
})

gulp.task('watch', function() {
  gulp.watch(dir.dev.scss, ['sass'])
  gulp.watch(dir.dev.js, ['scripts'])
})

gulp.task('build', ['config', 'scripts', 'sass', 'stylesheets'])

gulp.task('default', ['build', 'watch'])
