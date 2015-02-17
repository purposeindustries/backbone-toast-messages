'use strict';

var $ = require('jquery');
var Backbone = require('backbone');

Backbone.$ = $;
window.$ = window.jQuery = $;

var ToastList = require('../../src/js/views/list');
var ToastCollection = require('../../src/js/collections/index');



$(document).ready(function () {

  var collection = new ToastCollection();
  var toasts = new ToastList({
    collection: collection
  });

  $(document.body).append(toasts.render().$el);

  $('#show-toast').on('click', function () {
    collection.add({
      text: 'Hello Toast!'
    });
  });

});
