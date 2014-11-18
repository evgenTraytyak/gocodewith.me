var express = require('express')
  , app = express()
  , http = require('http')
  , http = require('http')
  , url = require('url')
  , fs = require('fs')
  , log = require('npmlog')
  , dbConfig = require('./db')
  , mongoose = require('mongoose')
  , isStarted = !1
  , path = require('path')

var routes = require('./routes/index')

function saveDocument(jsonDoc) {

  if (!fs.existsSync(__dirname + path.sep + 'savedDocuments')) {
    fs.mkdirSync(__dirname + path.sep + 'savedDocuments')
  }

  fs.writeFileSync( __dirname + path.sep + 'savedDocuments'
              + path.sep + jsonDoc.docName, jsonDoc.docContent )
}


function getDocument(docId) {
  var pathToDoc = __dirname + path.sep + 'savedDocuments' + path.sep + docId

  if (fs.existsSync(pathToDoc)) {
    return fs.readFileSync(pathToDoc, 'utf8')
  }
  else {
    return null
  }

}

exports.start = function (config) {
  if (config && !isStarted) {
    try {
      mongoose.connect(dbConfig.url)

      http.createServer(function (request, response) {
        log.http(request.method + ' request', request.url)

        var urlParsed = url.parse(request.url, true)

        if (urlParsed.pathname == '/theme' && urlParsed.query.name) {
          var themePath = 'libs/codemirror/theme/' + urlParsed.query.name

          fs.readFile(themePath + '.css', 'utf8',  function (err, data) {
            if (err) throw err

            response.write(JSON.stringify(data))
            response.end()
          })
        }
        else if (urlParsed.pathname == '/theme' && !urlParsed.query.name) {
          fs.readdir('libs/codemirror/theme/', function (err, files) {
            if (err) throw err

            response.write(JSON.stringify(files))
            response.end()
          })
        }
        else if (request.method == 'POST') {
          var body = ''
          request.on('data', function (data) {
              body += data
          });
          request.on('end', function () {
            var jsonBody = JSON.parse(body)
            if (jsonBody.operation == 'save') {
              saveDocument(jsonBody)
            }
            else if (jsonBody.operation == 'get') {
              //console.log('getDocument ' + jsonBody.docName)
              var docContent = getDocument(jsonBody.docName)
              //console.log(docContent)
              var docObj = {
                value: docContent
              }

              var docJSON = JSON.stringify(docObj)

              if (docJSON !== null) {
                console.log(docJSON)
                //response.write(docJSON)
                response.end(docJSON)
              }
              else {
                console.log('nothing');
                response.end()
              }

            }

          });
        }
        else {
          //reading index file
          fs.readFile(config.index, function (err, page) {
            if (err) {
              log.error('HTTP server', err.message)
              response.writeHeader(500)
              response.end('Can\'t read ' + config.index +
                           ' file. (Try to create it: npm run make)')
              return
            }

            response.writeHeader(200, {'Content-Type': 'text/html'})
            response.write(page)
            response.end()
          })
        }
      }).listen(config.port)
      log.info('HTTP server', 'Server started at port ' + config.port)
      isStarted = !0
    } catch (e) {
      log.error('HTTP server', 'Server can\'t start. ' + e)
    }
  }
}


