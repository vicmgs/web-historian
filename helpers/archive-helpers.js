var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
var readSitesFile = function(callback) {
  fs.readFile(exports.paths.list, 'utf-8', function(error, content) {
    if (!error) {
      var urls = content.split('\n');
      callback(urls);
    } else {
      console.log(error);
    }
  });
};

var writeSitesFile = function(content, callback) {
  fs.appendFile(exports.paths.list, content, function(error) {
    if (!error) {
      callback();
    } else {
      console.log(error);
    }
  });
};

var checkFileExists = function(filePath, callback) {
  fs.stat(filePath, function(error) {
    callback(!error);
  });
};

var downloadFile = function(url, filePath, callback) {
  // the content should come from the real content file from the website
  fs.writeFile(filePath + url, url, function(error) {
    callback(!error);
  });
};

exports.readListOfUrls = function(callback) {
  readSitesFile(callback);
};

exports.isUrlInList = function(url, callback) {
  readSitesFile(function(urls) {
    callback(urls.indexOf(url) >= 0);
  });
};

exports.addUrlToList = function(url, callback) {
  writeSitesFile(url, callback);
};

exports.isUrlArchived = function(url, callback) {
  var filePath = exports.paths.archivedSites + '/' + url;
  checkFileExists(filePath, callback);
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    exports.isUrlArchived(url, function(archived) {
      if (!archived) {
        var filePath = exports.paths.archivedSites + '/';
        downloadFile(url, filePath, function(downloaded) {
        });
      }
    });
  });
};
