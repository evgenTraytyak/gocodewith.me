module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      'libs/jquery/dist/jquery.js',
      'libs/lodash/dist/lodash.min.js',
      'libs/socket.io-client/socket.io.js',
      'blocks/**/*.js',
      'tests/**/*spec.js'
    ],

    autoWatch: true
  });
};