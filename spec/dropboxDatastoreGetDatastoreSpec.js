describe('Backbone.DropboxDatastore.getDatastore', function() {
  var result;

  beforeEach(function() {
    spyOn(Backbone.DropboxDatastore, '_createDatastorePromise');
  });

  describe('if there is stored promise for passed datastoreId', function() {
    beforeEach(function() {
      Backbone.DropboxDatastore._datastorePromises = {
        datastoreIdMock:'storedDatastorePromiseMock'
      };

      result = Backbone.DropboxDatastore.getDatastore('datastoreIdMock');
    });

    it('returns stored promise', function() {
      expect(result).toBe('storedDatastorePromiseMock');
    });

    it('do not call _createDatastorePromise on DropboxDatastore', function() {
      expect(Backbone.DropboxDatastore._createDatastorePromise).not.toHaveBeenCalled();
    });
  });

  describe('if datastore is not opened', function() {
    beforeEach(function() {
      Backbone.DropboxDatastore._datastorePromises = {};
      Backbone.DropboxDatastore._createDatastorePromise.andReturn('datastorePromiseMock');

      result = Backbone.DropboxDatastore.getDatastore('datastoreIdMock');
    });

    it('call _createDatastorePromise on DropboxDatastore', function() {
      expect(Backbone.DropboxDatastore._createDatastorePromise).toHaveBeenCalledWith('datastoreIdMock');
    });

    it('store result of _createDatastorePromise on DropboxDatastore to _datastorePromises', function() {
      expect(Backbone.DropboxDatastore._datastorePromises.datastoreIdMock).toBe('datastorePromiseMock');
    });

    it('returns result of _createDatastorePromise on DropboxDatastore', function() {
      expect(result).toBe('datastorePromiseMock');
    });
  });
});

describe('Backbone.DropboxDatastore._createDatastorePromise', function() {
  var datastoreManagerSpy;

  beforeEach(function() {
    datastoreManagerSpy = jasmine.createSpyObj('datastoreManager', ['_getOrCreateDatastoreByDsid']);
    spyOn(Backbone.DropboxDatastore, 'getDatastoreManager').andReturn(datastoreManagerSpy);
  });

});
