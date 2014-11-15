var exec = require('child_process').exec

console.log('Installing node_modules ...')
exec('npm install', function(err) {

  if (err !== null) console.error('Exec error: \'npm install\'' + err)

  console.log('Node_modules was installed')
  console.log('Installing bower components ...')
  exec('bower install', function(err) {

    if (err !== null) console.error('Exec error \' Bower install\': ' + err)

    console.log('Bower components were installed ...')
    console.log('Run gulp ...')
    exec('npm run make', function(err) {

      if (err !== null) console.error('Exec error \'Gulp\': ' + err)

      console.log('Gulp was made')
      console.log('Started server')
      exec('node server.js')
    });
  })
})
