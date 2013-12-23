describe('Backbone.DropboxDatastore#getTable', function() {
  var result, dropboxDatastore;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    spyOn(dropboxDatastore, '_createTablePromise').andReturn('createdTablePromiseMock');
  });

  describe('if there is not stored _tablePromise', function() {
    beforeEach(function() {
      result = dropboxDatastore.getTable();
    });

    it('call _createTablePromise', function() {
      expect(dropboxDatastore._createTablePromise).toHaveBeenCalled();
    });

    it('store created table promise', function() {
      expect(dropboxDatastore._tablePromise).toBe('createdTablePromiseMock');
    });

    it('return created table promise', function() {
      expect(result).toBe('createdTablePromiseMock');
    });
  });

  describe('if there is stored _tablePromise', function() {
    beforeEach(function() {
      dropboxDatastore._tablePromise = 'storedTablePromiseMock';

      result = dropboxDatastore.getTable();
    });

    it('do not call _createTablePromise', function() {
      expect(dropboxDatastore._createTablePromise).not.toHaveBeenCalled();
    });

    it('return stored table promise', function() {
      expect(result).toBe('storedTablePromiseMock');
    });
  });
});

describe('Backbone.DropboxDatastore#_createTablePromise', function() {
  var resultPromise, dropboxDatastore, datastoreSpy;

  beforeEach(function() {
    var datastoreDefer = $.Deferred();
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    datastoreSpy = jasmine.createSpyObj('datastoreSpy', ['getTable']);
    datastoreSpy.getTable.andReturn('tableMock');
    datastoreDefer.resolve(datastoreSpy);
    spyOn(Backbone.DropboxDatastore, 'getDatastore').andReturn(datastoreDefer);
    spyOn(dropboxDatastore, '_startListenToChangeStatus');
    spyOn(dropboxDatastore, '_startListenToChangeRecords');

    resultPromise = dropboxDatastore._createTablePromise();
  });

  it('call getDatastore on Backbone.DropboxDatastore', function() {
    expect(Backbone.DropboxDatastore.getDatastore).toHaveBeenCalledWith('default');
  });

  it('call _startListenToChangeStatus', function() {
    expect(dropboxDatastore._startListenToChangeStatus).toHaveBeenCalledWith(datastoreSpy);
  });

  it('call _startListenToChangeRecords', function() {
    expect(dropboxDatastore._startListenToChangeRecords).toHaveBeenCalledWith(datastoreSpy);
  });

  it('call getTable on datastore', function() {
    expect(datastoreSpy.getTable).toHaveBeenCalledWith('tableName');
  });

  it('store table in _table when resolve', function() {
    expect(dropboxDatastore._table).toBe('tableMock');
  });

  it('return promise resolved by table', function() {
    resultPromise.then(function(result) {
      expect(result).toBe('tableMock');
    });
  });
});
