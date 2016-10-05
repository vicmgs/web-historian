var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var httpHelpers = require('./http-helpers');

var fileResponseReadHandler = function(res, filePath) {
  fs.readFile(filePath, function(error, content) {
    if (!error) {
      res.end(content, 'utf-8');
    } else {
      res.writeHead(404);
      res.end();
    }
  });
};

var addSiteTextFile = function(res, fileLocation, content) {
  fs.appendFile(fileLocation, content, function(error) {
    if (error) {
      console.log(error);
    } else {
      res.writeHead(302, httpHelpers.headers);
      res.end();
    }
  });
}

exports.handleRequest = function (req, res) {
  var statusCode = 200;

  if (req.url === '/') {
      if (req.method === 'GET') {
        res.writeHead(statusCode, httpHelpers.headers);

        var filePath = archive.paths.siteAssets + '/index.html';
        fileResponseReadHandler(res, filePath);
      } else if (req.method === 'POST') {
        var buffer = '';
        req.on('data', function(data) {
          buffer += data;
        });
        req.on('end', function(error) {
          var url = buffer.substring(buffer.indexOf('=') + 1);
          var filePath = archive.paths.list;
          addSiteTextFile(res, filePath, url + '\n');
        });
      }
  } else {
    if (req.method === 'GET') {
      res.writeHead(statusCode, httpHelpers.headers);
      var fixtureName = req.url.substring(1);
      var filePath = archive.paths.archivedSites + '/' + fixtureName;
      fileResponseReadHandler(res, filePath);
    }
  }
  // res.end(archive.paths.list);
};
