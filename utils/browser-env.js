'use strict';

require('./require-jade');
var jsdom = require('jsdom');

function setGlobals(window, done) {
  global.window = window;
  global.document = window.document;
  global.location = window.location;
  global.navigator = window.navigator;
  global.Backbone = require('backbone');
  global.Backbone.$ = require('jquery');
  global.$ = global.jQuery = global.Backbone.$;
  done(null, window);
}

module.exports.setup = function(callback) {

  if (typeof window != 'undefined') {
    setGlobals(window, callback);
    return;
  }

  jsdom.env({
    html: '<html><body></body></html>',
    done: function(errs, window) {
      if (errs) {
        return callback(errs);
      }
      setGlobals(window, callback);
    }
  });

};
