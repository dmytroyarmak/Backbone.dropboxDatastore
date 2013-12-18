describe('Backbone.DropboxDatastore#find', function() {
  var dropboxDatastore, getTableDefer, resultPromise;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    getTableDefer = $.Deferred();
    getTableDefer.resolve('tableMock');
    spyOn(dropboxDatastore, 'getTable').andReturn(getTableDefer.promise());
    spyOn(dropboxDatastore, '_findWithTable').andReturn('recordMock');
    spyOn(dropboxDatastore, '_throwIfNotFound').andReturn('checkedRecordMock');
    spyOn(Backbone.DropboxDatastore, 'recordToJson').andReturn('recordJsonMock');
    resultPromise = dropboxDatastore.find('modelMock');
  });

  it('call getTable', function() {
    expect(dropboxDatastore.getTable).toHaveBeenCalled();
  });

  it('call _findWithTable', function() {
    expect(dropboxDatastore._findWithTable).toHaveBeenCalledWith('modelMock', 'tableMock');
  });

  it('call _throwIfNotFound with found record', function() {
    expect(dropboxDatastore._throwIfNotFound).toHaveBeenCalledWith('recordMock');
  });

  it('call Backbone.DropboxDatastore.recordToJson with found record', function() {
    expect(Backbone.DropboxDatastore.recordToJson).toHaveBeenCalledWith('checkedRecordMock');
  });

  it('return promise with fields of found record', function() {
    resultPromise.then(function(result) {
      expect(result).toBe('recordJsonMock');
    });
  });
});

describe('Backbone.DropboxDatastore#_throwIfNotFound', function() {
  it('throw if record is null', function() {
    expect(function() {
      Backbone.DropboxDatastore.prototype._throwIfNotFound(null);
    }).toThrow();
  });

  it('do not throw if record passed', function() {
    expect(function() {
      Backbone.DropboxDatastore.prototype._throwIfNotFound('recordMock');
    }).not.toThrow();
  });

  it('return passed record', function() {
    var result = Backbone.DropboxDatastore.prototype._throwIfNotFound('recordMock');
    expect(result).toBe('recordMock');
  });
});

describe('Backbone.DropboxDatastore#_findWithTable', function() {

  var dropboxDatastore, modelSpy, tableSpy, result;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
  });

  describe('when model have id', function() {

    beforeEach(function() {
      modelSpy = jasmine.createSpyObj('model', ['isNew']);
      modelSpy.isNew.andReturn(false);
      modelSpy.id = 'idMock';
    });

    describe('with idAttribute equal "id"', function() {

      beforeEach(function() {
        modelSpy.idAttribute = 'id';
        tableSpy = jasmine.createSpyObj('table', ['get']);
        tableSpy.get.andReturn('recordSpy');

        result = dropboxDatastore._findWithTable(modelSpy, tableSpy);
      });

      it('call get on table', function() {
        expect(tableSpy.get).toHaveBeenCalledWith('idMock');
      });

      it('return found record', function() {
        expect(result).toBe('recordSpy');
      });

    });

    describe('with idAttribute not equal "id"', function() {

      beforeEach(function() {
        modelSpy.idAttribute = 'idAttributeMock';
        tableSpy = jasmine.createSpyObj('table', ['query']);
        tableSpy.query.andReturn(['recordSpy']);

        result = dropboxDatastore._findWithTable(modelSpy, tableSpy);
      });

      it('call query on table', function() {
        expect(tableSpy.query).toHaveBeenCalledWith({idAttributeMock: 'idMock'});
      });

      it('return found record', function() {
        expect(result).toBe('recordSpy');
      });

    });

  });

  describe('when model does not have id', function() {
    beforeEach(function() {
      modelSpy = jasmine.createSpyObj('model', ['isNew']);
      modelSpy.isNew.andReturn(true);
    });

    it('throw error', function() {
      expect(function() {
        dropboxDatastore._findWithTable(modelSpy, tableSpy);
      }).toThrow();
    });

  });

});
