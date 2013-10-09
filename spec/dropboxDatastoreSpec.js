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

    var tableSpy, callbackSpy;

    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');

      spyOn(Backbone.DropboxDatastore, 'recordToJson').andCallFake(function(record) {
        switch(record) {
          case 'record1Spy': return 'fields1Mock';
          case 'record2Spy': return 'fields2Mock';
        }
      });

      tableSpy = jasmine.createSpyObj('table', ['query']);
      tableSpy.query.andReturn(['record1Spy', 'record2Spy']);
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

    var callbackSpy;

    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');

      spyOn(dropboxDatastore, 'getTable');
      spyOn(dropboxDatastore, '_findRecordSync').andReturn('recordMock');
      spyOn(Backbone.DropboxDatastore, 'recordToJson').andReturn('fieldsMock');

      dropboxDatastore.find('modelMock', callbackSpy);

      // Explicit call callback on success getTable
      dropboxDatastore.getTable.mostRecentCall.args[0]('tableMock');
    });

    it('call getTable', function() {
      expect(dropboxDatastore.getTable).toHaveBeenCalled();
    });

    it('call #_findRecordSync with table and model', function() {
      expect(dropboxDatastore._findRecordSync).toHaveBeenCalledWith('tableMock', 'modelMock');
    });

    it('call Backbone.DropboxDatastore.recordToJson with found record', function() {
      expect(Backbone.DropboxDatastore.recordToJson).toHaveBeenCalledWith('recordMock');
    });

    it('call callback with fields', function() {
      expect(callbackSpy).toHaveBeenCalledWith('fieldsMock');
    });

  });

  describe('#_findRecordSync', function() {

    var modelSpy, tableSpy, result;

    describe('when model have id', function() {

      beforeEach(function() {
        modelSpy = jasmine.createSpyObj('model', ['isNew']);
        modelSpy.isNew.andReturn(false);
        modelSpy.id = 'idMock';
      });

      describe('with idAttribute equal "id"', function() {

        beforeEach(function() {
          modelSpy.idAttribute = 'id';
          tableSpy = jasmine.createSpyObj('table', ['get']);
        });

        describe('when record exists', function() {
          beforeEach(function() {
            tableSpy.get.andReturn('recordSpy');

            result = dropboxDatastore._findRecordSync(tableSpy, modelSpy);
          });

          it('call get on table', function() {
            expect(tableSpy.get).toHaveBeenCalledWith('idMock');
          });

          it('return found record', function() {
            expect(result).toBe('recordSpy');
          });

        });

        describe('when record does not exist', function() {
          beforeEach(function() {
            tableSpy.get.andReturn(null);
          });

          it('throw error: result not found', function() {
            expect(function() {
              dropboxDatastore._findRecordSync(tableSpy, modelSpy);
            }).toThrow();
          });
        });
      });

      describe('with idAttribute not equal "id"', function() {

        beforeEach(function() {
          tableSpy = jasmine.createSpyObj('table', ['query']);
          modelSpy.idAttribute = 'idAttributeMock';
        });

        describe('when record exists', function() {
          beforeEach(function() {
            tableSpy.query.andReturn(['recordSpy']);

            result = dropboxDatastore._findRecordSync(tableSpy, modelSpy);
          });

          it('call query on table', function() {
            expect(tableSpy.query).toHaveBeenCalledWith({idAttributeMock: 'idMock'});
          });

          it('return found record', function() {
            expect(result).toBe('recordSpy');
          });

        });

        describe('when record does not exist', function() {
          beforeEach(function() {
            tableSpy.query.andReturn([]);
          });

          it('throw error: result not found', function() {
            expect(function() {
              dropboxDatastore._findRecordSync(tableSpy, modelSpy);
            }).toThrow();
          });
        });
      });

    });

    describe('when model does not have id', function() {
      beforeEach(function() {
        modelSpy = jasmine.createSpyObj('model', ['isNew']);
        modelSpy.isNew.andReturn(true);
      });

      it('throw error', function() {
        expect(function() {
          dropboxDatastore._findRecordSync(tableSpy, modelSpy);
        }).toThrow();
      });

    });

  });

  describe('#create', function() {

    var tableSpy, callbackSpy, modelSpy;

    beforeEach(function() {
      callbackSpy = jasmine.createSpy('callback');

      modelSpy = jasmine.createSpyObj('model', ['toJSON']);
      modelSpy.toJSON.andReturn('modelAttributesMock');

      spyOn(Backbone.DropboxDatastore, 'recordToJson').andCallFake(function(record) {
        if (record === 'recordSpy') {
          return 'fieldsMock';
        }
      });

      spyOn(dropboxDatastore, 'getTable');

      dropboxDatastore.create(modelSpy, callbackSpy);

      tableSpy = jasmine.createSpyObj('table', ['insert']);
      tableSpy.insert.andReturn('recordSpy');

      // Explicit call callback on success getTable
      dropboxDatastore.getTable.mostRecentCall.args[0](tableSpy);
    });

    it('call getTable', function() {
      expect(dropboxDatastore.getTable).toHaveBeenCalled();
    });

    it('call insert on table', function() {
      expect(modelSpy.toJSON).toHaveBeenCalled();
      expect(tableSpy.insert).toHaveBeenCalledWith('modelAttributesMock');
    });

    it('call Backbone.DropboxDatastore.recordToJson with created record', function() {
      expect(Backbone.DropboxDatastore.recordToJson).toHaveBeenCalledWith('recordSpy');
    });

    it('call callback with fields of new record', function() {
      expect(callbackSpy).toHaveBeenCalledWith('fieldsMock');
    });
  });

  describe('#update', function() {

    var modelSpy, callbackSpy, recordSpy;

    beforeEach(function() {
      modelSpy = jasmine.createSpyObj('model', ['toJSON']);
      modelSpy.toJSON.andReturn('attributesMock');
      callbackSpy = jasmine.createSpy();
      recordSpy = jasmine.createSpyObj('foundRecord', ['update']);
      spyOn(dropboxDatastore, 'getTable').andReturn('tableMock');
      spyOn(dropboxDatastore, '_findRecordSync').andReturn(recordSpy);
      spyOn(Backbone.DropboxDatastore, 'recordToJson').andReturn('fieldsMock');

      dropboxDatastore.update(modelSpy, callbackSpy);

      // Explicit call callback on success getTable
      dropboxDatastore.getTable.mostRecentCall.args[0]('tableMock');
    });

    it('call getTable', function() {
      expect(dropboxDatastore.getTable).toHaveBeenCalled();
    });
    it('call #_findRecordSync', function() {
      expect(dropboxDatastore._findRecordSync).toHaveBeenCalledWith('tableMock', modelSpy);
    });
    it('call update on found record ', function() {
      expect(recordSpy.update).toHaveBeenCalledWith('attributesMock');
    });
    it('call Backbone.DropboxDatastore.recordToJson with updated record', function() {
      expect(Backbone.DropboxDatastore.recordToJson).toHaveBeenCalledWith(recordSpy);
    });
    it('call callback with fields of updated record', function() {
      expect(callbackSpy).toHaveBeenCalledWith('fieldsMock');
    });
  });


  describe('#destroy', function() {

    var modelSpy, callbackSpy, recordSpy;

    beforeEach(function() {
      modelSpy = jasmine.createSpyObj('model', ['toJSON']);
      modelSpy.toJSON.andReturn('attributesMock');
      callbackSpy = jasmine.createSpy();
      recordSpy = jasmine.createSpyObj('foundRecord', ['deleteRecord']);
      spyOn(dropboxDatastore, 'getTable').andReturn('tableMock');
      spyOn(dropboxDatastore, '_findRecordSync').andReturn(recordSpy);

      dropboxDatastore.destroy(modelSpy, callbackSpy);

      // Explicit call callback on success getTable
      dropboxDatastore.getTable.mostRecentCall.args[0]('tableMock');
    });

    it('call getTable', function() {
      expect(dropboxDatastore.getTable).toHaveBeenCalled();
    });
    it('call #_findRecordSync', function() {
      expect(dropboxDatastore._findRecordSync).toHaveBeenCalledWith('tableMock', modelSpy);
    });
    it('call deleteRecord on found record ', function() {
      expect(recordSpy.deleteRecord).toHaveBeenCalledWith();
    });

    it('call callback with empty object', function() {
      expect(callbackSpy).toHaveBeenCalledWith({});
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

  describe('sync', function() {
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

});
