'use strict';

var ToastModel = require('../../src/js/models/index');
var ToastCollection = require('../../src/js/collections/index');

describe('ToastCollection', function () {

  it('should be empty', function () {
    var collection = new ToastCollection();
    collection.length.should.equal(0);
  });

  it('should create a toast model', function () {
    var collection = new ToastCollection([
      {
        text: 'toast 1'
      }
    ]);
    var toast = collection.at(0);
    collection.length.should.equal(1);
    toast.should.be.instanceOf(ToastModel);
    toast.get('text').should.equal('toast 1');
  });

});
