'use strict';
var Backbone = require('backbone');
var ToastModel = require('../models/index');
/**
 * @class ToastCollection
 * @extends Backbone.Collection
 */
module.exports = Backbone.Collection.extend({
  model: ToastModel
});
