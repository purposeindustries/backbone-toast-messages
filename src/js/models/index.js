'use strict';
var Backbone = require('backbone');
/**
 * @class ToastModel
 * @extends = Backbone.Model
 */
module.exports = Backbone.Model.extend({
  defaults: {
    delay: 3000,
    text: ''
  },
  /**
   * @function
   * @constructs
   * @returns {void}
   */
  initialize: function () {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.listenTo(this, 'destroy', this.killTimer);
  },
  /**
   * starts a timer according to the model's delay property.
   *
   * @function
   * @param {Function} done   it's called when the timer finishes.
   * @returns {void}
   */
  startTimer: function (done) {
    this.timeoutID = setTimeout(done, this.get('delay'));
  },

  /**
   * @function
   * @returns {void}
   */
  killTimer: function () {
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
  }
});
