'use strict';

var fs = require('fs');
var jade = require('jade');
require.extensions['.jade'] = function(module, data) {
  var content = fs.readFileSync(module.filename);
  var str = 'var jade = require(\'jade\').runtime;\nmodule.exports = ' + jade.compileClient(content, {filename: module.filename});
  return module._compile(str, data);
};
