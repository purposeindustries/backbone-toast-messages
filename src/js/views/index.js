'use strict';
var Backbone = require('backbone');
var template = require('../../templates/index.jade');

module.exports = Backbone.View.extend({

    className: 'toast',

    initialize: function () {
      Backbone.View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function () {
      this.$el.html(template(this.model.toJSON()));
      return this;
    }
  });
