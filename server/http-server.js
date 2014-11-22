var express = require('express')
  , app = express()
  , path = require('path')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , url = require('url')
  , httpLogger = require('morgan')
  , log = require('npmlog')
  , fs = require('fs')

// Morgan logger
app.use(httpLogger('dev'))

// Connect to DB
var mongoose = require('mongoose')
  , dbConfig = require('./db')

mongoose.connect(dbConfig.url)

// View engine setup
app.set('views', path.resolve(__dirname, '..', 'views'))
app.set('view engine', 'jade')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, '..', 'public')))

// Configuring Passport
var passport = require('passport')
  , expressSession = require('express-session')

app.use(expressSession({secret: 'keyboard cat'}))

// Middleware for initialize passport in Express
app.use(passport.initialize())
app.use(passport.session())

// Initialize Passport
var initPassport = require('../passport/init');
initPassport(passport);

// Add routing
var routes = require('../routes/index')(passport)
app.use('/', routes)




module.exports = {
  start: function (server) {
    app.listen(server.port, function (err) {
    })
  }
}

// function saveDocument(jsonDoc) {

//   if (!fs.existsSync(__dirname + path.sep + 'savedDocuments')) {
//     fs.mkdirSync(__dirname + path.sep + 'savedDocuments')
//   }

//   fs.writeFileSync( __dirname + path.sep + 'savedDocuments'
//               + path.sep + jsonDoc.docName, jsonDoc.docContent )
// }


// function getDocument(docId) {
//   var pathToDoc = __dirname + path.sep + 'savedDocuments' + path.sep + docId

//   if (fs.existsSync(pathToDoc)) {
//     return fs.readFileSync(pathToDoc, 'utf8')
//   }
//   else {
//     return null
//   }

// }

// exports.start = function (config) {
//   if (config && !isStarted) {
//     try {
//       mongoose.connect(dbConfig.url)

//       http.createServer(function (request, response) {
//         log.http(request.method + ' request', request.url)

//         var urlParsed = url.parse(request.url, true)

//         if (urlParsed.pathname == '/theme' && urlParsed.query.name) {
//           var themePath = 'libs/codemirror/theme/' + urlParsed.query.name

//           fs.readFile(themePath + '.css', 'utf8',  function (err, data) {
//             if (err) throw err

//             response.write(JSON.stringify(data))
//             response.end()
//           })
//         }
//         else if (urlParsed.pathname == '/theme' && !urlParsed.query.name) {
//           fs.readdir('libs/codemirror/theme/', function (err, files) {
//             if (err) throw err

//             response.write(JSON.stringify(files))
//             response.end()
//           })
//         }
//         else if (request.method == 'POST') {
//           var body = ''
//           request.on('data', function (data) {
//               body += data
//           });
//           request.on('end', function () {
//             var jsonBody = JSON.parse(body)
//             if (jsonBody.operation == 'save') {
//               saveDocument(jsonBody)
//             }
//             else if (jsonBody.operation == 'get') {
//               //console.log('getDocument ' + jsonBody.docName)
//               var docContent = getDocument(jsonBody.docName)
//               //console.log(docContent)
//               var docObj = {
//                 value: docContent
//               }

//               var docJSON = JSON.stringify(docObj)

//               if (docJSON !== null) {
//                 console.log(docJSON)
//                 //response.write(docJSON)
//                 response.end(docJSON)
//               }
//               else {
//                 console.log('nothing');
//                 response.end()
//               }

//             }

//           });
//         }
//         else {
//           //reading index file
//           fs.readFile(config.index, function (err, page) {
//             if (err) {
//               log.error('HTTP server', err.message)
//               response.writeHeader(500)
//               response.end('Can\'t read ' + config.index +
//                            ' file. (Try to create it: npm run make)')
//               return
//             }

//             response.writeHeader(200, {'Content-Type': 'text/html'})
//             response.write(page)
//             response.end()
//           })
//         }
//       }).listen(config.port)
//       log.info('HTTP server', 'Server started at port ' + config.port)
//       isStarted = !0
//     } catch (e) {
//       log.error('HTTP server', 'Server can\'t start. ' + e)
//     }
//   }
// }


