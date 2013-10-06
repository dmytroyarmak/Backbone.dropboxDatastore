describe('Backbone.sync', function() {

  var syncSpy;

  beforeEach(function() {
    syncSpy = jasmine.createSpy('syncSpy');
    spyOn(Backbone, 'getSyncMethod').andReturn(syncSpy);
  });

  it('delegate call to result of Backbone.getSyncMethod', function() {
    Backbone.sync('methodMock', 'modelMock', 'optionsMock');

    expect(Backbone.getSyncMethod).toHaveBeenCalledWith('modelMock');
    expect(syncSpy).toHaveBeenCalledWith('methodMock', 'modelMock', 'optionsMock');
  });

});

describe('Backbone.getSyncMethod', function(){

  var DropboxDatastoreModel = Backbone.Model.extend({
        dropboxDatastore: 'dropboxDatastoreMock'
      }),
      DropboxDatastoreCollection = Backbone.Collection.extend({
        dropboxDatastore: 'dropboxDatastoreMock'
      });

  beforeEach(function() {
    spyOn(Backbone, 'ajaxSync');
    spyOn(Backbone, 'dropboxDatastoreSync');
  });

  it('for model with dropboxDatastore returns dropboxDatastoreSync', function() {
    var model = new DropboxDatastoreModel();
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.dropboxDatastoreSync);
  });

  it('for model without dropboxDatastore returns ajaxSync', function() {
    var model = new Backbone.Model();
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.ajaxSync);
  });

  it('for model of collection with dropboxDatastore returns dropboxDatastoreSync', function() {
    var collection = new DropboxDatastoreCollection(),
        model = new Backbone.Model({}, {collection: collection});
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.dropboxDatastoreSync);
  });

  it('for collection with dropboxDatastore returns dropboxDatastoreSync', function() {
    var collection = new DropboxDatastoreCollection();
    expect(Backbone.getSyncMethod(collection)).toBe(Backbone.dropboxDatastoreSync);
  });

  it('for collection without dropboxDatastore returns ajaxSync', function() {
    var collection = new Backbone.Collection();
    expect(Backbone.getSyncMethod(collection)).toBe(Backbone.ajaxSync);
  });

});

describe('Backbone.DropboxDatastore instance methods', function() {

  var dropboxDatastore;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
  });

  it('store passed argument into name property', function() {
    expect(dropboxDatastore.name).toBe('tableName');
  });

});

describe('Backbone.DropboxDatastore static methods', function() {

  describe('getDropboxClient', function() {

    it('throw error if Backbone.DropboxDatastore.client is not defined', function() {
      Backbone.DropboxDatastore.client = undefined;
      expect(function() {
        Backbone.DropboxDatastore.getDropboxClient();
      }).toThrow();
    });

    it('throw error if Backbone.DropboxDatastore.client is not authorized', function() {
      Backbone.DropboxDatastore.client = jasmine.createSpyObj('client', ['isAuthenticated']);
      Backbone.DropboxDatastore.client.isAuthenticated.andReturn(false);
      expect(function() {
        Backbone.DropboxDatastore.getDropboxClient();
      }).toThrow();
    });

    it('return Backbone.DropboxDatastore.client if defined and authorized', function() {
      Backbone.DropboxDatastore.client = jasmine.createSpyObj('client', ['isAuthenticated']);
      Backbone.DropboxDatastore.client.isAuthenticated.andReturn(true);
      expect(Backbone.DropboxDatastore.getDropboxClient()).toBe(Backbone.DropboxDatastore.client);
    });

  });

  describe('getDatastoreManager', function() {

    it('return result of calling getDatastoreManager on result of getDropboxClient', function() {
      var clientSpy = jasmine.createSpyObj('client', ['getDatastoreManager']),
          result;
      clientSpy.getDatastoreManager.andReturn('datastoreManagerMock');
      spyOn(Backbone.DropboxDatastore, 'getDropboxClient').andReturn(clientSpy);

      result = Backbone.DropboxDatastore.getDatastoreManager();

      expect(Backbone.DropboxDatastore.getDropboxClient).toHaveBeenCalled();
      expect(clientSpy.getDatastoreManager).toHaveBeenCalled();
      expect(result).toBe('datastoreManagerMock');
    });

  });

  describe('getDatastore', function() {
    var datastoreManagerSpy, callbackSpy;

    beforeEach(function() {
      datastoreManagerSpy = jasmine.createSpyObj('datastoreManager', ['openDefaultDatastore']);
      spyOn(Backbone.DropboxDatastore, 'getDatastoreManager').andReturn(datastoreManagerSpy);
      callbackSpy = jasmine.createSpy('callback');
    });

    describe('if Datastore is not opened', function() {

      beforeEach(function() {
        Backbone.DropboxDatastore.getDatastore(callbackSpy);
      });

      it('call openDefaultDatastore on datastoreManager', function() {
        expect(datastoreManagerSpy.openDefaultDatastore).toHaveBeenCalled();
      });

      describe('if openDefaultDatastore processed with error', function() {
        it('throw an error', function() {
          expect(function() {
            datastoreManagerSpy.openDefaultDatastore.mostRecentCall.args[0]('errorMock', null);
          }).toThrow();
        });
      });

      describe('if openDefaultDatastore processed without errors', function() {

        beforeEach(function() {
          datastoreManagerSpy.openDefaultDatastore.mostRecentCall.args[0](null, 'datastoreMock');
        });

        it('cache returned Datastore and call callback with cached Datastore', function() {
          expect(callbackSpy).toHaveBeenCalledWith('datastoreMock');
          expect(Backbone.DropboxDatastore._datastore).toBe('datastoreMock');
        });

      });
    });

    describe('if Datastore is opened', function() {

      beforeEach(function() {
        Backbone.DropboxDatastore._datastore = 'cachedDatastoreMock';
        runs(function() {
          Backbone.DropboxDatastore.getDatastore(callbackSpy);
        });
        waitsFor(function() {
          return callbackSpy.calls.length;
        }, 'The callback should be called.', 10);
      });

      it('do not call openDefaultDatastore on datastoreManager', function() {
        expect(datastoreManagerSpy.openDefaultDatastore).not.toHaveBeenCalled();
      });

      it('call callback with cached Datastore', function() {
        expect(callbackSpy).toHaveBeenCalledWith('cachedDatastoreMock');
      });

    });
  });

});
