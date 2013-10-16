describe('Backbone.DropboxDatastore', function() {

  var dropboxDatastore;



  describe('if datastoreId is passed to options', function() {
    beforeEach(function() {
      dropboxDatastore = new Backbone.DropboxDatastore('tableName', {
        datastoreId: 'datastoreIdMock'
      });
    });

    it('store first argument into name property', function() {
      expect(dropboxDatastore.name).toBe('tableName');
    });

    it('set datastoreId to default', function() {
      expect(dropboxDatastore.datastoreId).toBe('datastoreIdMock');
    });
  });

  describe('if datastoreId is not passed to options', function() {
    beforeEach(function() {
      dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    });

    it('store first argument into name property', function() {
      expect(dropboxDatastore.name).toBe('tableName');
    });

    it('set datastoreId to default', function() {
      expect(dropboxDatastore.datastoreId).toBe('default');
    });
  });

});
