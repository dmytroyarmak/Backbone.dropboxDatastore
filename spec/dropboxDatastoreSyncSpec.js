describe('Backbone.DropboxDatastore.sync', function() {
  var result, datastoreSpy;
  describe('for collection', function() {
    var collection;
    beforeEach(function() {
      datastoreSpy = jasmine.createSpyObj('datastore', ['findAll']);
      collection = new Backbone.Collection();
      collection.dropboxDatastore = datastoreSpy;
    });
    describe('method equal read', function() {
      beforeEach(function() {
        spyOn(_, 'partial').andReturn('partialAppliedSyncCallbackMock');
      });
      describe('there is Deferred method on Backbone.$', function() {
        var deferredSpy;
        beforeEach(function() {
          deferredSpy = jasmine.createSpyObj('deferred', ['promise']);
          deferredSpy.promise.andReturn('promiseMock');
          Backbone.$ = {
            Deferred: jasmine.createSpy('Deferred').andReturn(deferredSpy)
          };

          result = Backbone.DropboxDatastore.sync('read', collection, 'optionsMock');
        });
        it('create Deferred object', function() {
          expect(Backbone.$.Deferred).toHaveBeenCalled();
        });
        it('partial apply _syncCallback', function() {
          expect(_.partial).toHaveBeenCalledWith(Backbone.DropboxDatastore._syncCallback, collection, 'optionsMock', deferredSpy);
        });
        it('call findAll on dropboxDatastore with partial applied syncCallback', function() {
          expect(datastoreSpy.findAll).toHaveBeenCalledWith('partialAppliedSyncCallbackMock');
        });
        it('return promise of Deferred object', function() {
          expect(result).toBe('promiseMock');
        });
      });
      describe('there is no Deferred method on Backbone.$', function() {
        beforeEach(function() {
          Backbone.$ = {};

          result = Backbone.DropboxDatastore.sync('read', collection, 'optionsMock');
        });
        it('partial apply _syncCallback', function() {
          expect(_.partial).toHaveBeenCalledWith(Backbone.DropboxDatastore._syncCallback, collection, 'optionsMock', undefined);
        });
        it('call findAll on dropboxDatastore with partial applied syncCallback', function() {
          expect(datastoreSpy.findAll).toHaveBeenCalledWith('partialAppliedSyncCallbackMock');
        });
        it('return undefined', function() {
          expect(result).toBeUndefined();
        });
      });
    });
  });

  describe('for model', function() {
    var model;
    beforeEach(function() {
      datastoreSpy = jasmine.createSpyObj('datastore', ['find', 'create', 'update', 'destroy']);
      model = new Backbone.Model();
      model.collection = {
        dropboxDatastore: datastoreSpy
      };
    });
    describe('method equal read', function() {
      beforeEach(function() {
        spyOn(_, 'partial').andReturn('partialAppliedSyncCallbackMock');
      });
      describe('there is Deferred method on Backbone.$', function() {
        var deferredSpy;
        beforeEach(function() {
          deferredSpy = jasmine.createSpyObj('deferred', ['promise']);
          deferredSpy.promise.andReturn('promiseMock');
          Backbone.$ = {
            Deferred: jasmine.createSpy('Deferred').andReturn(deferredSpy)
          };

          result = Backbone.DropboxDatastore.sync('read', model, 'optionsMock');
        });
        it('create Deferred object', function() {
          expect(Backbone.$.Deferred).toHaveBeenCalled();
        });
        it('partial apply _syncCallback', function() {
          expect(_.partial).toHaveBeenCalledWith(Backbone.DropboxDatastore._syncCallback, model, 'optionsMock', deferredSpy);
        });
        it('call find on dropboxDatastore with model and partial applied syncCallback', function() {
          expect(datastoreSpy.find).toHaveBeenCalledWith(model, 'partialAppliedSyncCallbackMock');
        });
        it('return promise of Deferred object', function() {
          expect(result).toBe('promiseMock');
        });
      });
      describe('there is no Deferred method on Backbone.$', function() {
        beforeEach(function() {
          Backbone.$ = {};

          result = Backbone.DropboxDatastore.sync('read', model, 'optionsMock');
        });
        it('partial apply _syncCallback', function() {
          expect(_.partial).toHaveBeenCalledWith(Backbone.DropboxDatastore._syncCallback, model, 'optionsMock', undefined);
        });
        it('call find on dropboxDatastore with model and partial applied syncCallback', function() {
          expect(datastoreSpy.find).toHaveBeenCalledWith(model, 'partialAppliedSyncCallbackMock');
        });
        it('return undefined', function() {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('method equal create', function() {
      beforeEach(function() {
        spyOn(_, 'partial').andReturn('partialAppliedSyncCallbackMock');
      });
      describe('there is Deferred method on Backbone.$', function() {
        var deferredSpy;
        beforeEach(function() {
          deferredSpy = jasmine.createSpyObj('deferred', ['promise']);
          deferredSpy.promise.andReturn('promiseMock');
          Backbone.$ = {
            Deferred: jasmine.createSpy('Deferred').andReturn(deferredSpy)
          };

          result = Backbone.DropboxDatastore.sync('create', model, 'optionsMock');
        });
        it('create Deferred object', function() {
          expect(Backbone.$.Deferred).toHaveBeenCalled();
        });
        it('partial apply _syncCallback', function() {
          expect(_.partial).toHaveBeenCalledWith(Backbone.DropboxDatastore._syncCallback, model, 'optionsMock', deferredSpy);
        });
        it('call create on dropboxDatastore with model and partial applied syncCallback', function() {
          expect(datastoreSpy.create).toHaveBeenCalledWith(model, 'partialAppliedSyncCallbackMock');
        });
        it('return promise of Deferred object', function() {
          expect(result).toBe('promiseMock');
        });
      });
      describe('there is no Deferred method on Backbone.$', function() {
        beforeEach(function() {
          Backbone.$ = {};

          result = Backbone.DropboxDatastore.sync('create', model, 'optionsMock');
        });
        it('partial apply _syncCallback', function() {
          expect(_.partial).toHaveBeenCalledWith(Backbone.DropboxDatastore._syncCallback, model, 'optionsMock', undefined);
        });
        it('call create on dropboxDatastore with model and partial applied syncCallback', function() {
          expect(datastoreSpy.create).toHaveBeenCalledWith(model, 'partialAppliedSyncCallbackMock');
        });
        it('return undefined', function() {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('method equal update', function() {
      beforeEach(function() {
        spyOn(_, 'partial').andReturn('partialAppliedSyncCallbackMock');
      });
      describe('there is Deferred method on Backbone.$', function() {
        var deferredSpy;
        beforeEach(function() {
          deferredSpy = jasmine.createSpyObj('deferred', ['promise']);
          deferredSpy.promise.andReturn('promiseMock');
          Backbone.$ = {
            Deferred: jasmine.createSpy('Deferred').andReturn(deferredSpy)
          };

          result = Backbone.DropboxDatastore.sync('update', model, 'optionsMock');
        });
        it('create Deferred object', function() {
          expect(Backbone.$.Deferred).toHaveBeenCalled();
        });
        it('partial apply _syncCallback', function() {
          expect(_.partial).toHaveBeenCalledWith(Backbone.DropboxDatastore._syncCallback, model, 'optionsMock', deferredSpy);
        });
        it('call update on dropboxDatastore with model and partial applied syncCallback', function() {
          expect(datastoreSpy.update).toHaveBeenCalledWith(model, 'partialAppliedSyncCallbackMock');
        });
        it('return promise of Deferred object', function() {
          expect(result).toBe('promiseMock');
        });
      });
      describe('there is no Deferred method on Backbone.$', function() {
        beforeEach(function() {
          Backbone.$ = {};

          result = Backbone.DropboxDatastore.sync('update', model, 'optionsMock');
        });
        it('partial apply _syncCallback', function() {
          expect(_.partial).toHaveBeenCalledWith(Backbone.DropboxDatastore._syncCallback, model, 'optionsMock', undefined);
        });
        it('call update on dropboxDatastore with model and partial applied syncCallback', function() {
          expect(datastoreSpy.update).toHaveBeenCalledWith(model, 'partialAppliedSyncCallbackMock');
        });
        it('return undefined', function() {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('method equal delete', function() {
      beforeEach(function() {
        spyOn(_, 'partial').andReturn('partialAppliedSyncCallbackMock');
      });
      describe('there is Deferred method on Backbone.$', function() {
        var deferredSpy;
        beforeEach(function() {
          deferredSpy = jasmine.createSpyObj('deferred', ['promise']);
          deferredSpy.promise.andReturn('promiseMock');
          Backbone.$ = {
            Deferred: jasmine.createSpy('Deferred').andReturn(deferredSpy)
          };

          result = Backbone.DropboxDatastore.sync('delete', model, 'optionsMock');
        });
        it('create Deferred object', function() {
          expect(Backbone.$.Deferred).toHaveBeenCalled();
        });
        it('partial apply _syncCallback', function() {
          expect(_.partial).toHaveBeenCalledWith(Backbone.DropboxDatastore._syncCallback, model, 'optionsMock', deferredSpy);
        });
        it('call destroy on dropboxDatastore with model and partial applied syncCallback', function() {
          expect(datastoreSpy.destroy).toHaveBeenCalledWith(model, 'partialAppliedSyncCallbackMock');
        });
        it('return promise of Deferred object', function() {
          expect(result).toBe('promiseMock');
        });
      });
      describe('there is no Deferred method on Backbone.$', function() {
        beforeEach(function() {
          Backbone.$ = {};

          result = Backbone.DropboxDatastore.sync('delete', model, 'optionsMock');
        });
        it('partial apply _syncCallback', function() {
          expect(_.partial).toHaveBeenCalledWith(Backbone.DropboxDatastore._syncCallback, model, 'optionsMock', undefined);
        });
        it('call destroy on dropboxDatastore with model and partial applied syncCallback', function() {
          expect(datastoreSpy.destroy).toHaveBeenCalledWith(model, 'partialAppliedSyncCallbackMock');
        });
        it('return undefined', function() {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});

describe('_syncCallback', function() {
  var options;
  describe('options.success is passed', function() {
    beforeEach(function() {
      options = {success: jasmine.createSpy('successCallback')};
    });
    describe('Backbone.VERSION is 0.9.10', function() {
      beforeEach(function() {
        Backbone.VERSION = '0.9.10';
      });
      describe('syncDfd is passed', function() {
        var deferredSpy;
        beforeEach(function() {
          deferredSpy = jasmine.createSpyObj('deferred', ['resolve']);
          Backbone.DropboxDatastore._syncCallback('modelMock', options, deferredSpy, 'respMock');
        });
        it('call callback with 3 params', function() {
          expect(options.success).toHaveBeenCalledWith('modelMock', 'respMock', options);
        });
        it('call resolve on syncDfd', function() {
          expect(deferredSpy.resolve).toHaveBeenCalledWith('respMock');
        });
      });
      describe('syncDfd is not passed', function() {
        beforeEach(function() {
          Backbone.DropboxDatastore._syncCallback('modelMock', options, null, 'respMock');
        });
        it('call callback with 3 params', function() {
          expect(options.success).toHaveBeenCalledWith('modelMock', 'respMock', options);
        });
      });
    });
    describe('Backbone.VERSION is not 0.9.10', function() {
      beforeEach(function() {
        Backbone.VERSION = '1.0.0';
      });
      describe('syncDfd is passed', function() {
        var deferredSpy;
        beforeEach(function() {
          deferredSpy = jasmine.createSpyObj('deferred', ['resolve']);
          Backbone.DropboxDatastore._syncCallback('modelMock', options, deferredSpy, 'respMock');
        });
        it('call callback with 1 param', function() {
          expect(options.success).toHaveBeenCalledWith('respMock');
        });
        it('call resolve on syncDfd', function() {
          expect(deferredSpy.resolve).toHaveBeenCalledWith('respMock');
        });
      });
      describe('syncDfd is not passed', function() {
        beforeEach(function() {
          Backbone.DropboxDatastore._syncCallback('modelMock', options, null, 'respMock');
        });
        it('call callback with 1 param', function() {
          expect(options.success).toHaveBeenCalledWith('respMock');
        });
      });
    });
  });

  describe('options.success is not passed', function() {
    describe('syncDfd is passed', function() {
      var deferredSpy;
      beforeEach(function() {
        deferredSpy = jasmine.createSpyObj('deferred', ['resolve']);
        Backbone.DropboxDatastore._syncCallback('modelMock', {}, deferredSpy, 'respMock');
      });
      it('call resolve on syncDfd', function() {
        expect(deferredSpy.resolve).toHaveBeenCalledWith('respMock');
      });
    });
    describe('syncDfd is not passed', function() {
      beforeEach(function() {
        Backbone.DropboxDatastore._syncCallback('modelMock', {}, null, 'respMock');
        it('do nothing');
      });
    });
  });
});
