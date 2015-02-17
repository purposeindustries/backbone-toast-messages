'use strict';
var Backbone = require('backbone');
var ToastView = require('./index');
var velocity = require('velocity-animate');
var velocityUI = require('velocity-animate/velocity.ui');

module.exports = Backbone.View.extend({

    className: 'toast-list',

    initialize: function () {
      Backbone.View.prototype.initialize.apply(this, arguments);

      if (this.collection) {
        this.listenTo(this.collection, 'add', this.add);
        this.listenTo(this.collection, 'reset', this.render);
      }
    },

    show: function (toast, done) {
      toast.$el
        .css({
          opacity: 0,
          top: parseFloat(toast.$el.css('top')) + 40 + 'px'
        })
        .velocity({
          opacity: 1,
          top: 0
        }, {
          duration: 300,
          queue: false,
          complete: done
        });
    },

    hide: function (toast) {
      toast.$el.velocity({
        opacity: 0,
        marginTop: '-40px'
      }, {
        duration: 300,
        queue: false,
        complete: function () {
          toast.model.destroy();
        }
      });
    },

    create: function (toast) {
      return new this.constructor.ToastView({
        model: toast
      });
    },

    append: function (toast) {
      this.$el.append(toast.render().$el);
    },

    bindOnce: function (toast) {
      toast.$el
        .one('click', function () {
          this.hide(toast);
        }.bind(this));
    },

    add: function (toast) {
      var toastView = this.create(toast);

      this.append(toastView);
      this.bindOnce(toastView);
      this.show(toastView, function () {
        toast.startTimer(function () {
          this.hide(toastView);
        }.bind(this));
      }.bind(this));
    },

    render: function () {
      this.collection.forEach(this.add, this);
      return this;
    }
  }, {
    ToastView: ToastView
  });
