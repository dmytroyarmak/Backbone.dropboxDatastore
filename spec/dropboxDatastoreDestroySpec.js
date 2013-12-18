describe('Backbone.DropboxDatastore#destroy', function() {
  var resultPromise, dropboxDatastore, getTableDefer;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');

    getTableDefer = $.Deferred();
    getTableDefer.resolve('tableMock');
    spyOn(dropboxDatastore, 'getTable').andReturn(getTableDefer.promise());
    spyOn(dropboxDatastore, '_destroyWithTable').andReturn('destroyedMock');

    resultPromise = dropboxDatastore.destroy('modelMock');
  });

  it('call getTable', function() {
    expect(dropboxDatastore.getTable).toHaveBeenCalled();
  });

  it('call _destroyWithTable with table', function() {
    expect(dropboxDatastore._destroyWithTable).toHaveBeenCalledWith('modelMock', 'tableMock');
  });

  it('return promise with result of _destroyWithTable', function() {
    resultPromise.then(function(result) {
      expect(result).toBe('destroyedMock');
    });
  });
});

describe('Backbone.DropboxDatastore#_destroyWithTable', function() {
  var result, dropboxDatastore, modelSpy;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    modelSpy = jasmine.createSpyObj('model', ['toJSON']);
    modelSpy.toJSON.andReturn('attributesMock');
  });

  describe('when model exists', function() {
    var recordSpy;
    beforeEach(function() {
      recordSpy = jasmine.createSpyObj('foundRecord', ['deleteRecord']);
      spyOn(dropboxDatastore, '_findWithTable').andReturn(recordSpy);

      result = dropboxDatastore._destroyWithTable(modelSpy, 'tableMock');
    });

    it('call #_findWithTable', function() {
      expect(dropboxDatastore._findWithTable).toHaveBeenCalledWith(modelSpy, 'tableMock');
    });

    it('call deleteRecord on found record ', function() {
      expect(recordSpy.deleteRecord).toHaveBeenCalledWith();
    });

    it('return empty object', function() {
      expect(result).toEqual({});
    });
  });

  describe('when model does not exist', function() {
    beforeEach(function() {
      spyOn(dropboxDatastore, '_findWithTable').andReturn(null);

      dropboxDatastore._destroyWithTable(modelSpy, 'tableMock');
    });

    it('call #_findWithTable', function() {
      expect(dropboxDatastore._findWithTable).toHaveBeenCalledWith(modelSpy, 'tableMock');
    });

    it('return empty object', function() {
      expect(result).toEqual({});
    });
  });
});
