describe('Backbone.DropboxDatastore#update', function() {

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
      recordSpy = jasmine.createSpyObj('foundRecord', ['update']);
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
  describe('when model does not exist', function() {
    var tableSpy;
    beforeEach(function() {
      spyOn(dropboxDatastore, '_findRecordSync').andReturn(null);
      tableSpy = jasmine.createSpyObj('table', ['insert']);
      tableSpy.insert.andReturn('recordMock');

      spyOn(Backbone.DropboxDatastore, 'recordToJson').andReturn('fieldsMock');

      dropboxDatastore.update(modelSpy, callbackSpy);

      // Explicit call callback on success getTable
      dropboxDatastore.getTable.mostRecentCall.args[0](tableSpy);
    });

    it('call getTable', function() {
      expect(dropboxDatastore.getTable).toHaveBeenCalled();
    });
    it('call #_findRecordSync', function() {
      expect(dropboxDatastore._findRecordSync).toHaveBeenCalledWith(tableSpy, modelSpy);
    });
    it('call insert on table ', function() {
      expect(tableSpy.insert).toHaveBeenCalledWith('attributesMock');
    });
    it('call Backbone.DropboxDatastore.recordToJson with inserted record', function() {
      expect(Backbone.DropboxDatastore.recordToJson).toHaveBeenCalledWith('recordMock');
    });
    it('call callback with fields of updated record', function() {
      expect(callbackSpy).toHaveBeenCalledWith('fieldsMock');
    });
  });

});
