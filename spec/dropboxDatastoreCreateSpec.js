describe('Backbone.DropboxDatastore#create', function() {

  var dropboxDatastore, tableSpy, callbackSpy, modelSpy;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');

    callbackSpy = jasmine.createSpy('callback');

    modelSpy = jasmine.createSpyObj('model', ['toJSON']);
    modelSpy.toJSON.andReturn('modelAttributesMock');

    spyOn(Backbone.DropboxDatastore, 'recordToJson').andCallFake(function(record) {
      if (record === 'recordSpy') {
        return 'fieldsMock';
      }
    });

    spyOn(dropboxDatastore, 'getTable');

    dropboxDatastore.create(modelSpy, callbackSpy);

    tableSpy = jasmine.createSpyObj('table', ['insert']);
    tableSpy.insert.andReturn('recordSpy');

    // Explicit call callback on success getTable
    dropboxDatastore.getTable.mostRecentCall.args[0](tableSpy);
  });

  it('call getTable', function() {
    expect(dropboxDatastore.getTable).toHaveBeenCalled();
  });

  it('call insert on table', function() {
    expect(modelSpy.toJSON).toHaveBeenCalled();
    expect(tableSpy.insert).toHaveBeenCalledWith('modelAttributesMock');
  });

  it('call Backbone.DropboxDatastore.recordToJson with created record', function() {
    expect(Backbone.DropboxDatastore.recordToJson).toHaveBeenCalledWith('recordSpy');
  });

  it('call callback with fields of new record', function() {
    expect(callbackSpy).toHaveBeenCalledWith('fieldsMock');
  });
});
