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

    var tableSpy, callbackSpy, record1Spy, record2Spy;

    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');

      record1Spy = jasmine.createSpyObj('record1', ['getFields']);
      record2Spy = jasmine.createSpyObj('record2', ['getFields']);

      spyOn(Backbone.DropboxDatastore, 'recordToJson').andCallFake(function(record) {
        switch(record) {
          case record1Spy: return 'fields1Mock';
          case record2Spy: return 'fields2Mock';
        }
      });

      tableSpy = jasmine.createSpyObj('table', ['query']);
      tableSpy.query.andReturn([record1Spy, record2Spy]);
      spyOn(dropboxDatastore, 'getTable');

      dropboxDatastore.findAll(callbackSpy);

      // Explicit call callback on success getTable
      dropboxDatastore.getTable.mostRecentCall.args[0](tableSpy);
    });

    it('call getTable', function() {
      expect(dropboxDatastore.getTable).toHaveBeenCalled();
    });

    it('call query on table', function() {
      expect(tableSpy.query).toHaveBeenCalled();
    });

    it('call Backbone.DropboxDatastore.recordToJson with each returned records', function() {
      expect(Backbone.DropboxDatastore.recordToJson.calls.length).toBe(2);
    });

    it('call callback with array of fields', function() {
      expect(callbackSpy).toHaveBeenCalledWith(['fields1Mock', 'fields2Mock']);
    });
  });

  describe('#find', function() {

    var modelSpy, tableSpy, callbackSpy, recordSpy;

    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');

      tableSpy = jasmine.createSpyObj('table', ['query']);
      spyOn(dropboxDatastore, 'getTable');
    });

    describe('when model have id', function() {

      beforeEach(function() {
        modelSpy = jasmine.createSpyObj('model', ['isNew']);
        modelSpy.isNew.andReturn(false);
        modelSpy.id = 'idMock';
      });

      describe('when record exists', function() {
        beforeEach(function() {
          recordSpy = jasmine.createSpyObj('record', ['getFields']);
          spyOn(Backbone.DropboxDatastore, 'recordToJson').andReturn('fieldsMock');
          tableSpy.query.andReturn([recordSpy]);

          dropboxDatastore.find(modelSpy, callbackSpy);

          // Explicit call callback on success getTable
          dropboxDatastore.getTable.mostRecentCall.args[0](tableSpy);
        });

        it('call getTable', function() {
          expect(dropboxDatastore.getTable).toHaveBeenCalled();
        });

        it('call query on table', function() {
          expect(tableSpy.query).toHaveBeenCalled();
        });

        it('call Backbone.DropboxDatastore.recordToJson on returned record', function() {
          expect(Backbone.DropboxDatastore.recordToJson).toHaveBeenCalledWith(recordSpy);
        });

        it('call callback with fields', function() {
          expect(callbackSpy).toHaveBeenCalledWith('fieldsMock');
        });

      });

      describe('when record does not exist', function() {
        beforeEach(function() {
          tableSpy = jasmine.createSpyObj('table', ['query']);
          tableSpy.query.andReturn([]);

          dropboxDatastore.find(modelSpy, callbackSpy);
        });

        it('throw error: result not found', function() {
          expect(function() {
            dropboxDatastore.getTable.mostRecentCall.args[0](tableSpy);
          }).toThrow();
        });
      });

    });

    describe('when model does not have id', function() {
      beforeEach(function() {
        modelSpy = jasmine.createSpyObj('model', ['isNew']);
        modelSpy.isNew.andReturn(true);

        tableSpy = jasmine.createSpyObj('table', ['query']);
        tableSpy.query.andReturn([]);

        dropboxDatastore.find(modelSpy, callbackSpy);
      });

      it('throw error', function() {
        expect(function() {
          dropboxDatastore.getTable.mostRecentCall.args[0](tableSpy);
        }).toThrow();
      });

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
      recordSpy = jasmine.createSpyObj('record', ['getFields', 'getId']);
      recordSpy.getFields.andReturn({foo: 1, bar: 'lalala'});
      recordSpy.getId.andReturn('idMock');
      result = Backbone.DropboxDatastore.recordToJson(recordSpy);
    });

    it('call getFields of record', function() {
      expect(recordSpy.getFields).toHaveBeenCalled();
    });

    it('return result of getFields', function() {
      expect(result).toEqual({id: 'idMock', foo: 1, bar: 'lalala'});
    });

  });

});
