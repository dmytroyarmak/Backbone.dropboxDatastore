describe('Backbone.DropboxDatastore#getStatus', function() {

  var dropboxDatastore, result;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
  });

  describe('when table is not opened', function() {
    beforeEach(function() {
      dropboxDatastore._table = undefined;
      result = dropboxDatastore.getStatus();
    });
    it('returns synced', function() {
      expect(result).toBe('synced');
    });
  });
  describe('when table is opened', function() {
    var datastoreSpy;
    beforeEach(function() {
      datastoreSpy = jasmine.createSpyObj('datastore', ['getSyncStatus']);
      dropboxDatastore._table = {_datastore: datastoreSpy};
    });
    describe('if getSyncStatus().uploading equal true', function() {
      beforeEach(function() {
        datastoreSpy.getSyncStatus.andReturn({uploading: true});
        result = dropboxDatastore.getStatus();
      });
      it('calls getSyncStatus on datastore of the table', function() {
        expect(datastoreSpy.getSyncStatus).toHaveBeenCalled();
      });
      it('returns uploading', function() {
        expect(result).toBe('uploading');
      });
    });
    describe('if getSyncStatus().uploading equal false', function() {
      beforeEach(function() {
        datastoreSpy.getSyncStatus.andReturn({uploading: false});
        result = dropboxDatastore.getStatus();
      });
      it('calls getSyncStatus on datastore of the table', function() {
        expect(datastoreSpy.getSyncStatus).toHaveBeenCalled();
      });
      it('returns synced', function() {
        expect(result).toBe('synced');
      });
    });
  });
});
