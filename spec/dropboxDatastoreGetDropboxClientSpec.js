describe('Backbone.DropboxDatastore.getDropboxClient', function() {

  it('throw error if Backbone.DropboxDatastore.client is not defined', function() {
    Backbone.DropboxDatastore.client = undefined;
    expect(function() {
      Backbone.DropboxDatastore.getDropboxClient();
    }).toThrow();
  });

  it('throw error if Backbone.DropboxDatastore.client is not authorized', function() {
    Backbone.DropboxDatastore.client = jasmine.createSpyObj('client', ['isAuthenticated']);
    Backbone.DropboxDatastore.client.isAuthenticated.andReturn(false);
    expect(function() {
      Backbone.DropboxDatastore.getDropboxClient();
    }).toThrow();
  });

  it('return Backbone.DropboxDatastore.client if defined and authorized', function() {
    Backbone.DropboxDatastore.client = jasmine.createSpyObj('client', ['isAuthenticated']);
    Backbone.DropboxDatastore.client.isAuthenticated.andReturn(true);
    expect(Backbone.DropboxDatastore.getDropboxClient()).toBe(Backbone.DropboxDatastore.client);
  });

});
