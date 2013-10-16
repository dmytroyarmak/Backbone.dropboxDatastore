describe('Backbone.DropboxDatastore#findAll', function() {

  var dropboxDatastore, tableSpy, callbackSpy;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    callbackSpy = jasmine.createSpy('callback');

    spyOn(Backbone.DropboxDatastore, 'recordToJson').andCallFake(function(record) {
      switch(record) {
        case 'record1Spy': return 'fields1Mock';
        case 'record2Spy': return 'fields2Mock';
      }
    });

    tableSpy = jasmine.createSpyObj('table', ['query']);
    tableSpy.query.andReturn(['record1Spy', 'record2Spy']);
    spyOn(dropboxDatastore, 'getTable');

    dropboxDatastore.findAll(callbackSpy);

    // Explicit call callback on success getTable
    dropboxDatastore.getTable.mostRecentCall.args[0](tableSpy);
  });

  it('call getTable', function() {
    expect(dropboxDatastore.getTable).toHaveBeenCalled();
  });

  it('call query on table', function() {
    expect(tableSpy.query).toHaveBeenCalled();
  });

  it('call Backbone.DropboxDatastore.recordToJson with each returned records', function() {
    expect(Backbone.DropboxDatastore.recordToJson.calls.length).toBe(2);
  });

  it('call callback with array of fields', function() {
    expect(callbackSpy).toHaveBeenCalledWith(['fields1Mock', 'fields2Mock']);
  });
});
