describe('Backbone.DropboxDatastore#destroy', function() {

  var dropboxDatastore, modelSpy, callbackSpy;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    modelSpy = jasmine.createSpyObj('model', ['toJSON']);
    modelSpy.toJSON.andReturn('attributesMock');
    callbackSpy = jasmine.createSpy();
    spyOn(dropboxDatastore, 'getTable');
  });

  describe('when model exists', function() {
    var recordSpy;
    beforeEach(function() {
      recordSpy = jasmine.createSpyObj('foundRecord', ['deleteRecord']);
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
  describe('when model does not exist', function() {
    beforeEach(function() {
      spyOn(dropboxDatastore, '_findRecordSync').andReturn(null);

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

    it('call callback with empty object', function() {
      expect(callbackSpy).toHaveBeenCalledWith({});
    });
  });
});
