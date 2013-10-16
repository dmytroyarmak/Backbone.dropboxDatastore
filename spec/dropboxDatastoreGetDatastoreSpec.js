describe('Backbone.DropboxDatastore.getDatastore', function() {
  var datastoreManagerSpy, callbackSpy;

  beforeEach(function() {
    datastoreManagerSpy = jasmine.createSpyObj('datastoreManager', ['_getOrCreateDatastoreByDsid']);
    spyOn(Backbone.DropboxDatastore, 'getDatastoreManager').andReturn(datastoreManagerSpy);
    callbackSpy = jasmine.createSpy('callback');
  });

  describe('if datastore is opened', function() {
    beforeEach(function() {
      Backbone.DropboxDatastore._datastores = {
        datastoreIdMock:'storedDatastoreMock'
      };

      runs(function() {
        Backbone.DropboxDatastore.getDatastore('datastoreIdMock', callbackSpy);
      });
      waitsFor(function() {
        return callbackSpy.calls.length;
      }, 'The callback should be called.', 10);
    });

    it('do not call _getOrCreateDatastoreByDsid on datastoreManager', function() {
      expect(datastoreManagerSpy._getOrCreateDatastoreByDsid).not.toHaveBeenCalled();
    });

    it('call callback with stored default Datastore', function() {
      expect(callbackSpy).toHaveBeenCalledWith('storedDatastoreMock');
    });

  });

  describe('if datastore is not opened', function() {
    beforeEach(function() {
      Backbone.DropboxDatastore._datastores = {};
      Backbone.DropboxDatastore.getDatastore('datastoreIdMock', callbackSpy);
    });

    it('call _getOrCreateDatastoreByDsid on datastoreManager', function() {
      expect(datastoreManagerSpy._getOrCreateDatastoreByDsid).toHaveBeenCalledWith(
        'datastoreIdMock',
        jasmine.any(Function)
      );
    });

    describe('if _getOrCreateDatastoreByDsid processed with error', function() {
      it('throw an error', function() {
        expect(function() {
          datastoreManagerSpy._getOrCreateDatastoreByDsid.mostRecentCall.args[1]('errorMock', null);
        }).toThrow();
      });
    });

    describe('if _getOrCreateDatastoreByDsid processed without errors', function() {

      beforeEach(function() {
        datastoreManagerSpy._getOrCreateDatastoreByDsid.mostRecentCall.args[1](null, 'datastoreMock');
      });

      it('store returned Datastore and call callback with stored Datastore', function() {
        expect(callbackSpy).toHaveBeenCalledWith('datastoreMock');
        expect(Backbone.DropboxDatastore._datastores.datastoreIdMock).toBe('datastoreMock');
      });

    });

  });
});

