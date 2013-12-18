describe('Backbone.DropboxDatastore#create', function() {
  var dropboxDatastore, getTableDefer, resultPromise;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    getTableDefer = $.Deferred();
    getTableDefer.resolve('tableMock');
    spyOn(dropboxDatastore, 'getTable').andReturn(getTableDefer.promise());
    spyOn(dropboxDatastore, '_createWithTable').andReturn('createdRecordMock');
    spyOn(Backbone.DropboxDatastore, 'recordToJson').andReturn('recordJsonMock');
    resultPromise = dropboxDatastore.create('modelMock');
  });

  it('call getTable', function() {
    expect(dropboxDatastore.getTable).toHaveBeenCalled();
  });

  it('call _createWithTable', function() {
    expect(dropboxDatastore._createWithTable).toHaveBeenCalledWith('modelMock', 'tableMock');
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

describe('Backbone.DropboxDatastore#_createWithTable', function() {
  var result, dropboxDatastore, tableSpy, modelSpy;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');

    modelSpy = jasmine.createSpyObj('model', ['toJSON']);
    modelSpy.toJSON.andReturn('modelAttributesMock');

    tableSpy = jasmine.createSpyObj('table', ['insert']);
    tableSpy.insert.andReturn('recordSpy');

    result = dropboxDatastore._createWithTable(modelSpy, tableSpy);
  });

  it('call insert on table', function() {
    expect(modelSpy.toJSON).toHaveBeenCalled();
    expect(tableSpy.insert).toHaveBeenCalledWith('modelAttributesMock');
  });

  it('return new record', function() {
    expect(result).toBe('recordSpy');
  });
});
