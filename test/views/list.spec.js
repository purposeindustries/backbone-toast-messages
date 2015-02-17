'use strict';

/* eslint-disable no-unused-expressions */

var sinon = require('sinon');
var mockery = require('mockery');
var clientEnv = require('../../utils/browser-env');
var Backbone = require('backbone');
var _ = require('underscore');
var ToastListView;
var MockToastView;

describe('ToastListView', function () {

  before(function (done) {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    clientEnv.setup(function () {

      mockery.registerMock('velocity-animate', {});
      mockery.registerMock('velocity-animate/velocity.ui', {});

      ToastListView = require('../../src/js/views/list');

      done();
    });
  });
  after(function () {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('ToastListView.prototype.initialize', function () {

    it('should be default state', function () {
      var toastList = new ToastListView();
      toastList.$el.hasClass('toast-list').should.be.true;
    });

    it('should listen to the collection\'s add event', function () {
      var addStub = sinon.stub(ToastListView.prototype, 'add');
      var fakeCollection = _.extend({}, Backbone.Events);
      /* eslint-disable no-unused-vars */
      var toastList = new ToastListView({
        collection: fakeCollection
      });
      /* eslint-enable no-unused-vars */
      addStub.notCalled.should.be.true;
      fakeCollection.trigger('add');
      addStub.calledOnce.should.be.true;
      ToastListView.prototype.add.restore();
    });

    it('should listen to the collection\'s reset event', function () {
      var resetStub = sinon.stub(ToastListView.prototype, 'render');
      var fakeCollection = _.extend({}, Backbone.Events);
      /* eslint-disable no-unused-vars */
      var toastList = new ToastListView({
        collection: fakeCollection
      });
      /* eslint-enable no-unused-vars */
      resetStub.notCalled.should.be.true;
      fakeCollection.trigger('reset');
      resetStub.calledOnce.should.be.true;
      ToastListView.prototype.render.restore();
    });
  });

  describe('ToastListView.prototype.render', function () {

    it('should iterate over the collection', function () {
      var toasts = [{
        text: 'toast 1'
      }, {
        text: 'toast 2'
      }, {
        text: 'toast 3'
      }];
      var fakeCollection = new Backbone.Collection(toasts);
      var iteratorStub = sinon.spy(fakeCollection, 'forEach');
      var addStub = sinon.stub(ToastListView.prototype, 'add');
      var toastList = new ToastListView({
        collection: fakeCollection
      });

      toastList.render();
      iteratorStub.calledOnce.should.be.true;
      addStub.callCount.should.equal(3);

      ToastListView.prototype.add.restore();
      fakeCollection.forEach.restore();
    });
  });

  describe('ToastListView.prototype.create', function () {

    it('should create a ToastView instance with the given model', function () {

      var toastList = new ToastListView();
      var fakeModel = {};

      sinon.stub(toastList.constructor, 'ToastView');

      toastList.create(fakeModel);

      toastList.constructor.ToastView.calledOnce.should.be.true;
      toastList.constructor.ToastView.args[0][0].model.should.equal(fakeModel);
      toastList.constructor.ToastView.restore();
    });
  });

  describe('ToastListView.prototype.append', function () {

    it('should append the toast view to the list', function () {
      var toastList = new ToastListView();
      var appendSpy = sinon.spy(toastList.$el, 'append');
      var fakeToast = {
        render: sinon.stub().returns({
          $el: 'the html'
        })
      };
      toastList.append(fakeToast);

      fakeToast.render.calledOnce.should.be.true;
      appendSpy.calledOnce.should.be.true;
      appendSpy.args[0][0].should.equal('the html');

      toastList.$el.append.restore();
    });
  });

  describe('ToastListView.prototype.bindOnce', function () {

    it('should add click event listener', function () {
      var toastList = new ToastListView();
      var fakeToast = {
        $el: {
          one: sinon.stub()
        }
      };
      toastList.bindOnce(fakeToast);

      fakeToast.$el.one.calledOnce.should.be.true;
      fakeToast.$el.one.args[0][0].should.equal('click');
      fakeToast.$el.one.args[0][1].should.instanceOf(Function);
    });

    it('should hide the toast when event occurs', function () {
      var hideStub = sinon.stub(ToastListView.prototype, 'hide');
      var toastList = new ToastListView();
      var fakeToast = {
        $el: {
          one: sinon.stub()
        }
      };
      toastList.bindOnce(fakeToast);

      var eventCallback = fakeToast.$el.one.args[0][1];
      eventCallback.should.instanceOf(Function);
      eventCallback.apply(toastList, fakeToast);

      hideStub.calledOnce.should.be.true;
      hideStub.args[0][0].should.be.equal(fakeToast);

      ToastListView.prototype.hide.restore();
    });
  });

  describe('ToastListView.prototype.show', function () {

    it('should animate the toast with the appropariate params', function () {

      var velocityStub = sinon.stub();
      var fakeToast = {
        $el: {
          css: sinon.stub().returns({
            velocity: velocityStub
          }),
          velocity: sinon.stub()
        }
      };
      var fakeCallback = sinon.spy();
      var toastList = new ToastListView();
      toastList.show(fakeToast, fakeCallback);

      fakeToast.$el.velocity.notCalled.should.be.true;
      fakeToast.$el.css.calledTwice.should.be.true;
      fakeToast.$el.css.firstCall.args[0].should.equal('top');
      fakeToast.$el.css.secondCall.args[0].should.be.ok;
      fakeToast.$el.css.secondCall.args[0].opacity.should.equal(0);
      fakeToast.$el.css.secondCall.args[0].top.should.be.ok;

      velocityStub.calledOnce.should.be.true;
      velocityStub.args[0][0].should.be.ok;
      velocityStub.args[0][0].opacity.should.equal(1);
      velocityStub.args[0][0].top.should.equal(0);

      velocityStub.args[0][1].should.be.ok;
      velocityStub.args[0][1].duration.should.equal(300);
      velocityStub.args[0][1].queue.should.equal(false);
      velocityStub.args[0][1].complete.should.equal(fakeCallback);
    });

    it('should call callback when animation ends', function () {

      var velocityStub = sinon.stub();
      var fakeToast = {
        $el: {
          css: sinon.stub().returns({
            velocity: velocityStub
          })
        }
      };
      var fakeCallback = sinon.spy();
      var toastList = new ToastListView();
      toastList.show(fakeToast, fakeCallback);

      fakeCallback.notCalled.should.be.true;
      velocityStub.args[0][1].complete();
      fakeCallback.calledOnce.should.be.true;
    });
  });

  describe('ToastListView.prototype.hide', function () {

    it('should animate the toast message with the ' +
    'appropriate velocity params.', function () {
      var fakeToast = {
        $el: {
          velocity: sinon.stub()
        }
      };
      var toastList = new ToastListView();

      toastList.hide(fakeToast);

      fakeToast.$el.velocity.calledOnce.should.be.true;
      fakeToast.$el.velocity.args[0][0].should.be.ok;
      fakeToast.$el.velocity.args[0][0].opacity.should.equal(0);
      fakeToast.$el.velocity.args[0][0].marginTop.should.equal('-40px');
      fakeToast.$el.velocity.args[0][1].duration.should.equal(300);
      fakeToast.$el.velocity.args[0][1].queue.should.equal(false);
      fakeToast.$el.velocity.args[0][1].complete.should.instanceOf(Function);

    });

    it('should kill toast\'s model when animation ends', function () {
      var fakeToast = {
        $el: {
          velocity: sinon.stub()
        },
        model: {
          destroy: sinon.stub()
        }
      };
      var toastList = new ToastListView();
      toastList.hide(fakeToast);

      fakeToast.$el.velocity.calledOnce.should.be.true;
      fakeToast.$el.velocity.args[0][1].should.be.ok;

      fakeToast.model.destroy.notCalled.should.be.true;
      fakeToast.$el.velocity.args[0][1].complete();
      fakeToast.model.destroy.calledOnce.should.be.true;
    });
  });

  describe('ToastListView.prototype.add', function () {

    it('should work fine as a facade', function () {
      var fakeToastView = {};
      var create = sinon.stub(ToastListView.prototype, 'create')
        .returns(fakeToastView);
      var append = sinon.stub(ToastListView.prototype, 'append');
      var bindOnce = sinon.stub(ToastListView.prototype, 'bindOnce');
      var show = sinon.stub(ToastListView.prototype, 'show');

      var toastListView = new ToastListView();
      var fakeToastModel = {};
      toastListView.add(fakeToastModel);

      create.calledOnce.should.be.true;
      create.args[0][0].should.equal(fakeToastModel);

      append.calledOnce.should.be.true;
      append.args[0][0].should.equal(fakeToastView);

      bindOnce.calledOnce.should.be.true;
      bindOnce.args[0][0].should.equal(fakeToastView);

      show.calledOnce.should.be.true;
      show.args[0][0].should.equal(fakeToastView);
      show.args[0][1].should.instanceOf(Function);

      ToastListView.prototype.create.restore();
      ToastListView.prototype.append.restore();
      ToastListView.prototype.bindOnce.restore();
      ToastListView.prototype.show.restore();
    });
  });
});
