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
    spyOn(Backbone, 'originalSync');
    spyOn(Backbone.DropboxDatastore, 'sync');
  });

  it('for model with dropboxDatastore returns DropboxDatastore.sync', function() {
    var model = new DropboxDatastoreModel();
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.DropboxDatastore.sync);
  });

  it('for model without dropboxDatastore returns originalSync', function() {
    var model = new Backbone.Model();
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.originalSync);
  });

  it('for model of collection with dropboxDatastore returns DropboxDatastore.sync', function() {
    var collection = new DropboxDatastoreCollection(),
        model = new Backbone.Model({}, {collection: collection});
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.DropboxDatastore.sync);
  });

  it('for collection with dropboxDatastore returns DropboxDatastore.sync', function() {
    var collection = new DropboxDatastoreCollection();
    expect(Backbone.getSyncMethod(collection)).toBe(Backbone.DropboxDatastore.sync);
  });

  it('for collection without dropboxDatastore returns originalSync', function() {
    var collection = new Backbone.Collection();
    expect(Backbone.getSyncMethod(collection)).toBe(Backbone.originalSync);
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

  describe('#getTable', function() {

    var callbackSpy, datastoreSpy;

    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');
      datastoreSpy = jasmine.createSpyObj('datastore', ['getTable']);
      datastoreSpy.getTable.andReturn('tableMock');
      spyOn(Backbone.DropboxDatastore, 'getDatastore');

    });

    describe('if table is stored', function() {

      beforeEach(function() {
        dropboxDatastore.getTable(callbackSpy);
      });

      it('call getDatastore on Backbone.DropboxDatastore', function() {
        expect(Backbone.DropboxDatastore.getDatastore).toHaveBeenCalled();
      });

      describe('when callback called', function() {

        beforeEach(function() {
          // Explicit call callback because we stub getDatastore
          Backbone.DropboxDatastore.getDatastore.mostRecentCall.args[0](datastoreSpy);
        });

        it('store returned Datastore', function() {
          expect(dropboxDatastore._table).toBe('tableMock');
        });

        it('call callback with stored Datastore', function() {
          expect(callbackSpy).toHaveBeenCalledWith('tableMock');
        });

      });

    });

    describe('if table is not stored', function() {

      beforeEach(function() {
        dropboxDatastore._table = 'storedTableMock';
        runs(function() {
          dropboxDatastore.getTable(callbackSpy);
        });
        waitsFor(function() {
          return callbackSpy.calls.length;
        }, 'The callback should be called.', 10);
      });

      it('do not call getDatastore on Backbone.DropboxDatastore', function() {
        expect(Backbone.DropboxDatastore.getDatastore).not.toHaveBeenCalled();
      });

      it('call callback with stored Datastore', function() {
        expect(callbackSpy).toHaveBeenCalledWith('storedTableMock');
      });

    });

  });

  describe('#findAll', function() {

    var tableSpy, callbackSpy, record1Spy, record2Spy, result;

    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');

      record1Spy = jasmine.createSpyObj('record1', ['getFields']);
      record1Spy.getFields.andReturn('fields1Mock');

      record2Spy = jasmine.createSpyObj('record2', ['getFields']);
      record2Spy.getFields.andReturn('fields2Mock');

      tableSpy = jasmine.createSpyObj('table', ['query']);
      tableSpy.query.andReturn([record1Spy, record2Spy]);
      spyOn(dropboxDatastore, 'getTable');

      result = dropboxDatastore.findAll(callbackSpy);

      // Explicit call callback on success getTable
      dropboxDatastore.getTable.mostRecentCall.args[0](tableSpy);
    });

    it('call getTable', function() {
      expect(dropboxDatastore.getTable).toHaveBeenCalled();
    });

    it('call query on table', function() {
      expect(tableSpy.query).toHaveBeenCalled();
    });

    it('call getFields on each returned records and call callback with array of fields', function() {
      expect(record1Spy.getFields).toHaveBeenCalled();
      expect(record2Spy.getFields).toHaveBeenCalled();
    });

    it('call callback with array of fields', function() {
      expect(callbackSpy).toHaveBeenCalledWith(['fields1Mock', 'fields2Mock']);
    });
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

        it('store returned Datastore and call callback with stored Datastore', function() {
          expect(callbackSpy).toHaveBeenCalledWith('datastoreMock');
          expect(Backbone.DropboxDatastore._datastore).toBe('datastoreMock');
        });

      });
    });

    describe('if Datastore is opened', function() {

      beforeEach(function() {
        Backbone.DropboxDatastore._datastore = 'storedDatastoreMock';
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

      it('call callback with stored Datastore', function() {
        expect(callbackSpy).toHaveBeenCalledWith('storedDatastoreMock');
      });

    });
  });

  describe('recordToJson', function() {

    var recordSpy, result;

    beforeEach(function() {
      recordSpy = jasmine.createSpyObj('record', ['getFields']);

      result = Backbone.DropboxDatastore.recordToJson(recordSpy);
    });

    it('call getFields of record', function() {
      expect(recordSpy.getFields).toHaveBeenCalled();
    });

  });

});
