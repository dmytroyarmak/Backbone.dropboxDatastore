describe('Backbone.DropboxDatastore#close', function() {

  var dropboxDatastore;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    spyOn(dropboxDatastore, '_stopListenToChangeStatus');
  });

  describe('if table is opened', function() {
    beforeEach(function() {
      dropboxDatastore._table = {_datastore: 'datastoreMock'};
      dropboxDatastore.close();
    });
    it('calls _stopListenToChangeStatus with datastore', function() {
      expect(dropboxDatastore._stopListenToChangeStatus).toHaveBeenCalledWith('datastoreMock');
    });
  });

  describe('if table is not opened', function() {
    beforeEach(function() {
      dropboxDatastore._table = undefined;
      dropboxDatastore.close();
    });
    it('does not call _stopListenToChangeStatus', function() {
      expect(dropboxDatastore._stopListenToChangeStatus).not.toHaveBeenCalled();
    });
  });
});
