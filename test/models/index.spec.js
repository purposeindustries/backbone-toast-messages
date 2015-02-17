'use strict';

/* eslint-disable no-unused-expressions */

var ToastModel = require('../../src/js/models/index');
var sinon = require('sinon');

describe('ToastModel', function () {

  it('should have default values', function () {
    var model = new ToastModel();
    model.get('delay').should.equal(3000);
    model.get('text').should.equal('');
  });

  it('should set passed attributes', function () {
    var model = new ToastModel({
      delay: 5000,
      text: 'toast message'
    });

    model.get('delay').should.equal(5000);
    model.get('text').should.equal('toast message');
  });

  it('should kill timer on when destroy is triggered', function () {
    var spy = sinon.spy(ToastModel.prototype, 'killTimer');
    var model = new ToastModel();
    model.trigger('destroy');
    spy.calledOnce.should.be.true;
    ToastModel.prototype.killTimer.restore();
  });

  it('should start a timer depending on the delay property', function () {
    var spy = sinon.stub(global, 'setTimeout', function () {
      return '12345';
    });
    var callbackSpy = sinon.spy();
    var model = new ToastModel({
      delay: 5
    });
    model.startTimer(callbackSpy);
    model.timeoutID.should.equal('12345');
    spy.calledWith(callbackSpy, 5).should.be.true;
    global.setTimeout.restore();
  });

  it('should stop the running timer', function () {
    var spySetTimeOut = sinon.stub(global, 'setTimeout').returns(666);
    var spyClearTimeout = sinon.stub(global, 'clearTimeout', function () {});
    var model = new ToastModel({
      delay: 5
    });
    var callbackSpy = sinon.spy();

    model.startTimer(callbackSpy);
    model.timeoutID.should.be.ok;
    spySetTimeOut.calledOnce.should.be.true;
    model.killTimer();
    spyClearTimeout.calledOnce.should.be.true;
    (model.timeoutID === null).should.be.true;

    global.setTimeout.restore();
    global.clearTimeout.restore();
  });

  it('should not do anything when there is no running timer.', function () {
    var model = new ToastModel();
    /* eslint-disable no-wrap-func */
    (function () {
      model.killTimer();
    }).should.not.throw();
    /* eslint-enable no-wrap-func */
  });
});
