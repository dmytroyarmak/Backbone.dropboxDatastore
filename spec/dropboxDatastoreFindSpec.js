describe('Backbone.DropboxDatastore#find', function() {

  var dropboxDatastore, callbackSpy;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    callbackSpy = jasmine.createSpy('callback');
    spyOn(dropboxDatastore, 'getTable');
  });

  describe('when model exits', function() {
    beforeEach(function() {

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

  describe('when model does not exist', function() {
    beforeEach(function() {
      spyOn(dropboxDatastore, '_findRecordSync').andReturn(null);
      dropboxDatastore.find('modelMock', callbackSpy);
    });

    it('throw error', function() {
      expect(function() {
        // Explicit call callback on success getTable
        dropboxDatastore.getTable.mostRecentCall.args[0]('tableMock');
      }).toThrow();
    });
  });

});
