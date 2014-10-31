module.exports = function(config) {
  config.set({
    frameworks: ['jasmine-jquery', 'jasmine'],

    files: [
      'libs/jquery/dist/jquery.js',
      'libs/lodash/dist/lodash.min.js',
      'libs/socket.io-client/socket.io.js',
      'blocks/page/page.js',
      'blocks/roster/roster.js',
      'tests/**/*spec.js',
      'blocks/**/*.html',
      'index.html'
    ],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'blocks/**/*.js': ['coverage']
    },

    browsers: ["Firefox"],

    autoWatch: true
  })
}
