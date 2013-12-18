describe('Backbone.DropboxDatastore#update', function() {
  var dropboxDatastore, getTableDefer, resultPromise;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');

    getTableDefer = $.Deferred();
    getTableDefer.resolve('tableMock');
    spyOn(dropboxDatastore, 'getTable').andReturn(getTableDefer.promise());
    spyOn(dropboxDatastore, '_updateWithTable').andReturn('createdRecordMock');
    spyOn(Backbone.DropboxDatastore, 'recordToJson').andReturn('recordJsonMock');
    resultPromise = dropboxDatastore.update('modelMock');
  });

  it('call getTable', function() {
    expect(dropboxDatastore.getTable).toHaveBeenCalled();
  });

  it('call _updateWithTable', function() {
    expect(dropboxDatastore._updateWithTable).toHaveBeenCalledWith('modelMock', 'tableMock');
  });

  it('call Backbone.DropboxDatastore.recordToJson with found record', function() {
    expect(Backbone.DropboxDatastore.recordToJson).toHaveBeenCalledWith('createdRecordMock');
  });

  it('return promise with fields of found record', function() {
    resultPromise.then(function(result) {
      expect(result).toBe('recordJsonMock');
    });
  });
});

describe('Backbone.DropboxDatastore#_updateWithTable', function() {
  var result, dropboxDatastore, modelSpy;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    modelSpy = jasmine.createSpyObj('model', ['toJSON']);
    modelSpy.toJSON.andReturn('attributesMock');
  });

  describe('when model exists', function() {
    var recordSpy;

    beforeEach(function() {
      recordSpy = jasmine.createSpyObj('foundRecord', ['update']);
      spyOn(dropboxDatastore, '_findWithTable').andReturn(recordSpy);

      result = dropboxDatastore._updateWithTable(modelSpy, 'tableMock');
    });

    it('call #_findWithTable', function() {
      expect(dropboxDatastore._findWithTable).toHaveBeenCalledWith(modelSpy, 'tableMock');
    });

    it('call update on found record ', function() {
      expect(modelSpy.toJSON).toHaveBeenCalled();
      expect(recordSpy.update).toHaveBeenCalledWith('attributesMock');
    });

    it('return fields of updated record', function() {
      expect(result).toBe(recordSpy);
    });
  });

  describe('when model does not exist', function() {
    var tableSpy;

    beforeEach(function() {
      spyOn(dropboxDatastore, '_findWithTable').andReturn(null);
      tableSpy = jasmine.createSpyObj('table', ['insert']);
      tableSpy.insert.andReturn('recordMock');

      result = dropboxDatastore._updateWithTable(modelSpy, tableSpy);
    });

    it('call #_findWithTable', function() {
      expect(dropboxDatastore._findWithTable).toHaveBeenCalledWith(modelSpy, tableSpy);
    });

    it('call insert on table ', function() {
      expect(modelSpy.toJSON).toHaveBeenCalled();
      expect(tableSpy.insert).toHaveBeenCalledWith('attributesMock');
    });

    it('result fields of updated record', function() {
      expect(result).toBe('recordMock');
    });
  });
});
