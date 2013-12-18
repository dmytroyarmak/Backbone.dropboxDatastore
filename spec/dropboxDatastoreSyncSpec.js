describe('Backbone.DropboxDatastore.sync', function() {
  var resultPromise;

  beforeEach(function() {
    var defer = $.Deferred();
    defer.resolve('responseMock');
    spyOn(Backbone.DropboxDatastore, '_doSyncMethod').andReturn(defer);
    spyOn(Backbone.DropboxDatastore, '_callSuccessHandler').andReturn('responseAfterSuccessCallbackMock');

    resultPromise = Backbone.DropboxDatastore.sync('methodMock', 'modelMock', 'optionMock');
  });

  it('call _doSyncMethod', function() {
    expect(Backbone.DropboxDatastore._doSyncMethod).toHaveBeenCalledWith('modelMock', 'methodMock');
  });

  it('call _callSuccessHandler with response', function() {
    expect(Backbone.DropboxDatastore._callSuccessHandler).toHaveBeenCalledWith('modelMock', 'optionMock', 'responseMock');
  });

  it('return promise resolved by response', function() {
    resultPromise.then(function(result) {
      expect(result).toBe('responseAfterSuccessCallbackMock');
    });
  });
});

describe('Backbone.DropboxDatastore._doSyncMethod', function() {
  var result, storeSpy;

  beforeEach(function() {
    storeSpy = jasmine.createSpyObj('store', ['findAll', 'find', 'create', 'update', 'destroy']);
    storeSpy.findAll.andReturn('findAllResultMock');
    storeSpy.find.andReturn('findResultMock');
    storeSpy.create.andReturn('createResultMock');
    storeSpy.update.andReturn('updateResultMock');
    storeSpy.destroy.andReturn('destroyResultMock');

    spyOn(Backbone.DropboxDatastore, '_getStoreFromModel').andReturn(storeSpy);
  });

  describe('for collection', function() {
    describe('when method is read', function() {
      beforeEach(function() {
        var collection = new Backbone.Collection();
        result = Backbone.DropboxDatastore._doSyncMethod(collection, 'read');
      });

      it('call findAll', function() {
        expect(storeSpy.findAll).toHaveBeenCalledWith();
      });

      it('return result of findAll', function() {
        expect(result).toBe('findAllResultMock');
      });
    });
  });

  describe('for model', function() {
    describe('when method is read', function() {
      beforeEach(function() {
        result = Backbone.DropboxDatastore._doSyncMethod('modelMock', 'read');
      });

      it('call find', function() {
        expect(storeSpy.find).toHaveBeenCalledWith('modelMock');
      });

      it('return result of find', function() {
        expect(result).toBe('findResultMock');
      });
    });

    describe('when method is create', function() {
      beforeEach(function() {
        result = Backbone.DropboxDatastore._doSyncMethod('modelMock', 'create');
      });

      it('call create', function() {
        expect(storeSpy.create).toHaveBeenCalledWith('modelMock');
      });

      it('return result of create', function() {
        expect(result).toBe('createResultMock');
      });
    });

    describe('when method is update', function() {
      beforeEach(function() {
        result = Backbone.DropboxDatastore._doSyncMethod('modelMock', 'update');
      });

      it('call update', function() {
        expect(storeSpy.update).toHaveBeenCalledWith('modelMock');
      });

      it('return result of update', function() {
        expect(result).toBe('updateResultMock');
      });
    });

    describe('when method is delete', function() {
      beforeEach(function() {
        result = Backbone.DropboxDatastore._doSyncMethod('modelMock', 'delete');
      });

      it('call destroy', function() {
        expect(storeSpy.destroy).toHaveBeenCalledWith('modelMock');
      });

      it('return result of destroy', function() {
        expect(result).toBe('destroyResultMock');
      });
    });

    describe('when method is incorrect', function() {
      it('throw error', function() {
        expect(function() {
          Backbone.DropboxDatastore._doSyncMethod('modelMock', 'incorrectMethod');
        }).toThrow();
      });
    });
  });

});

describe('Backbone.DropboxDatastore._getStoreFromModel', function() {
  var result;

  it('return store of model if model have dropboxDatastore', function() {
    var model = {dropboxDatastore: 'modelsStoreMock'};

    result = Backbone.DropboxDatastore._getStoreFromModel(model);

    expect(result).toBe('modelsStoreMock');
  });

  it('return store of collection if model have not dropboxDatastore but collection have', function() {
    var model = {collection: {dropboxDatastore: 'collectionsStoreMock'}};

    result = Backbone.DropboxDatastore._getStoreFromModel(model);

    expect(result).toBe('collectionsStoreMock');
  });
});

describe('Backbone.DropboxDatastore._callSuccessHandler', function() {
  var result, options;

  describe('options.success is passed', function() {
    beforeEach(function() {
      options = {success: jasmine.createSpy('successCallback')};
    });

    describe('Backbone.VERSION is 0.9.10', function() {
      beforeEach(function() {
        Backbone.VERSION = '0.9.10';
        Backbone.DropboxDatastore._callSuccessHandler('modelMock', options, 'respMock');
      });

      it('call callback with 3 params', function() {
        expect(options.success).toHaveBeenCalledWith('modelMock', 'respMock', options);
      });
    });

    describe('Backbone.VERSION is not 0.9.10', function() {
      beforeEach(function() {
        Backbone.VERSION = '1.0.0';
        Backbone.DropboxDatastore._callSuccessHandler('modelMock', options, 'respMock');
      });

      it('call callback with 1 param', function() {
        expect(options.success).toHaveBeenCalledWith('respMock');
      });
    });
  });

  describe('options.success is not passed', function() {
    it('return response', function() {
      result = Backbone.DropboxDatastore._callSuccessHandler('modelMock', {}, 'responseMock');

      expect(result).toBe('responseMock');
    });
  });
});
