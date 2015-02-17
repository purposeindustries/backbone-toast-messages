'use strict';

/* eslint-disable no-unused-expressions */

var sinon = require('sinon');
var browser = require('../../utils/browser-env');
var Backbone = require('backbone');
var ToastView;

describe('ToastView', function () {

  before(function (done) {
    browser.setup(function () {
      ToastView = require('../../src/js/views/index');
      done();
    });
  });

  describe('ToastView.prototype.initialize', function () {

    it('should have a toast class', function () {
      var toastView = new ToastView({
        model: new Backbone.Model()
      });
      toastView.$el.hasClass('toast').should.be.true;
    });

    it('should be removed on model destroy', function () {

      var fakeModel = new Backbone.Model();
      var remove = sinon.stub(ToastView.prototype, 'remove');
      /* eslint-disable no-unused-vars */
      var toastView = new ToastView({
        model: fakeModel
      });
      /* eslint-enable no-unused-vars */
      fakeModel.trigger('destroy');
      remove.calledOnce.should.be.true;
      ToastView.prototype.remove.restore();
    });

    it('should render the appropriate template', function () {

      var toastView = new ToastView({
        model: new Backbone.Model()
      });

      toastView.render();
      toastView.$el.html().should.equal('<div class="toast-inner"><span>' +
      '</span></div>');
    });

    it('should render the model data correctly', function () {

      var toastView = new ToastView({
        model: new Backbone.Model({
          text: 'Hello World!'
        })
      });

      toastView.render();
      toastView.$el.html().should.equal('<div class="toast-inner"><span>' +
      'Hello World!' +
      '</span></div>');
    });
  });
});
