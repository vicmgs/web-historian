var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var httpHelpers = require('./http-helpers');

// var fileResponseReadHandler = function(res, filePath) {
//   fs.readFile(filePath, function(error, content) {
//     if (!error) {
//       res.end(content, 'utf-8');
//     } else {
//       res.writeHead(404);
//       res.end();
//     }
//   });
// };

exports.handleRequest = function (req, res) {
  // var statusCode = 200;

  if (req.url === '/') {
    if (req.method === 'GET') {
      var filePath = archive.paths.siteAssets + '/index.html';
      res.writeHead(200, httpHelpers.headers);
      httpHelpers.serveAssets(res, filePath);
    } else if (req.method === 'POST') {
      var buffer = '';
      req.on('data', function(data) {
        buffer += data;
      });
      req.on('end', function(error) {
        var url = buffer.substring(buffer.indexOf('=') + 1);
        var filePath = archive.paths.list;

        // check if the url is already on the list?
        // call the archive helper
        archive.isUrlInList(url, function(isInList) {
          if (!isInList) {
            archive.addUrlToList(url + '\n', function() {
              res.writeHead(302, httpHelpers.headers);
              var filePath = archive.paths.siteAssets + '/loading.html';
              httpHelpers.serveAssets(res, filePath);
            });
          } else {
            archive.isUrlArchived(url, function(isArchived) {
              if (!isArchived) {
                // show the loading page
                res.writeHead(302, httpHelpers.headers);
                var filePath = archive.paths.siteAssets + '/loading.html';
                httpHelpers.serveAssets(res, filePath);
              } else { // exists in archived folder
                // Show the archived file to the client
                // res.writeHead(302, httpHelpers.headers);
                // var filePath = archive.paths.archivedSites +'/'+ url;
                // httpHelpers.serveAssets(res, filePath);
              }
            });
          }
        });

      });
    }
  } else {
    if (req.method === 'GET') {
      res.writeHead(200, httpHelpers.headers);
      var fixtureName = req.url.substring(1);
      var filePath = archive.paths.archivedSites + '/' + fixtureName;
      httpHelpers.serveAssets(res, filePath);
    }
  }
  // res.end(archive.paths.list);
};
