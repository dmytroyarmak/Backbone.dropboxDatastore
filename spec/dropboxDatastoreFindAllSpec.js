describe('Backbone.DropboxDatastore#findAll', function() {
  var resultPromise, dropboxDatastore, getTableDefer;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');

    getTableDefer = $.Deferred();
    getTableDefer.resolve('tableMock');
    spyOn(dropboxDatastore, 'getTable').andReturn(getTableDefer.promise());
    spyOn(dropboxDatastore, '_findAllWithTable').andReturn('foundRecordsMock');

    resultPromise = dropboxDatastore.findAll();
  });

  it('call getTable', function() {
    expect(dropboxDatastore.getTable).toHaveBeenCalled();
  });

  it('call _findAllWithTable with table', function() {
    expect(dropboxDatastore._findAllWithTable).toHaveBeenCalledWith('tableMock');
  });

  it('return promise with fields of found record', function() {
    resultPromise.then(function(result) {
      expect(result).toBe('foundRecordsMock');
    });
  });
});

describe('Backbone.DropboxDatastore#_findAllWithTable', function() {

  var result, dropboxDatastore, tableSpy;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');

    spyOn(Backbone.DropboxDatastore, 'recordToJson').andCallFake(function(record) {
      switch(record) {
        case 'record1Spy': return 'fields1Mock';
        case 'record2Spy': return 'fields2Mock';
      }
    });

    tableSpy = jasmine.createSpyObj('table', ['query']);
    tableSpy.query.andReturn(['record1Spy', 'record2Spy']);

    result = dropboxDatastore._findAllWithTable(tableSpy);
  });

  it('call query on table', function() {
    expect(tableSpy.query).toHaveBeenCalled();
  });

  it('call Backbone.DropboxDatastore.recordToJson with each returned records', function() {
    expect(Backbone.DropboxDatastore.recordToJson.calls.length).toBe(2);
  });

  it('return json of found records', function() {
    expect(result).toEqual(['fields1Mock', 'fields2Mock']);
  });
});
