'use strict';
var through = require('through2'),
    gmd = require('maven-deploy'),
    PluginError = require('gulp-util').PluginError;

var deploy = function(remote, options){
  options = options || {};
  if (!options.hasOwnProperty('config') || typeof options.config !== 'object') {
    throw new Error('Missing required property "config" object.');
  }

  return through.obj(function (file, enc, cb) {
    var self = this;
    gmd.config(options.config);
    if (options.hasOwnProperty('deploy')){
      if (!options.hasOwnProperty('repositoryId') || !options.hasOwnProperty('snapshot')){
        throw new Error('Deploy required "repositoryId" and "snapshot".');
      }
      gmd.deploy(options.repositoryId, options.snapshot, function(err) {
        if (err) {
            self.emit('error', new PluginError('gulp-maven-deploy', 'Maven exited with code ' + err.code));
        }
      });
    } else {
      gmd.install();
    }
  });
};

module.exports.deploy = deploy.bind(null, true);

module.exports.install = deploy.bind(null, false);
