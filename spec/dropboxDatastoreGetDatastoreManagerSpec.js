describe('Backbone.DropboxDatastore.getDatastoreManager', function() {

  it('return result of calling getDatastoreManager on result of getDropboxClient', function() {
    var clientSpy = jasmine.createSpyObj('client', ['getDatastoreManager']),
        result;
    clientSpy.getDatastoreManager.andReturn('datastoreManagerMock');
    spyOn(Backbone.DropboxDatastore, 'getDropboxClient').andReturn(clientSpy);

    result = Backbone.DropboxDatastore.getDatastoreManager();

    expect(Backbone.DropboxDatastore.getDropboxClient).toHaveBeenCalled();
    expect(clientSpy.getDatastoreManager).toHaveBeenCalled();
    expect(result).toBe('datastoreManagerMock');
  });

});
