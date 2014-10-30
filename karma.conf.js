module.exports = function(config) {
  config.set({
    frameworks: ['jasmine-jquery', 'jasmine'],

    files: [
      'libs/jquery/dist/jquery.js',
      'libs/lodash/dist/lodash.min.js',
      'libs/socket.io-client/socket.io.js',
      'blocks/roster/roster.js',
      'tests/**/*spec.js',
      'blocks/**/*.html'
    ],

    browsers: ["Firefox"]
  })
}
