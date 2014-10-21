/**
 * Created by dmantsevich on 10/21/2014.
 */
var NODE_ENV_PROP = 'NODE_ENV'
  , envPattern = new RegExp('^' + NODE_ENV_PROP + '=(.*)$')
  , ENV = '__DEFAULT__'
  , SYSTEM_ENV = process.env
  , configMappings = {
      '__DEFAULT__': './dev.json'
    , 'DEVELOPMENT' : './dev.json'
    , 'PRODUCTION' : './pro.json'
    }
  , isDefined = function (env) {
    return !!configMappings[env];
  }
  , log = require('npmlog')

// Try extract from SYSTEM ENV
if (isDefined(SYSTEM_ENV[NODE_ENV_PROP]))
  ENV = SYSTEM_ENV[NODE_ENV_PROP]

// Try to receive NODE_ENV=PRODUCTION from command line.
process.argv.slice(2).forEach(function (val) {
  try {
    val = val.match(envPattern);
    if (val && isDefined(val[1])) {
      ENV = val[1]
      return false
    }
  } catch (e) {
    log.error('Internal', 'Cant parse process args.')
  }
})

log.info('Internal', 'App running in ' + ENV.replace(/_/g, '') + ' environment')
module.exports = require(configMappings[ENV])