describe('Backbone.getSyncMethod', function(){

  var DropboxDatastoreModel = Backbone.Model.extend({
        dropboxDatastore: 'dropboxDatastoreMock'
      }),
      DropboxDatastoreCollection = Backbone.Collection.extend({
        dropboxDatastore: 'dropboxDatastoreMock'
      });

  beforeEach(function() {
    spyOn(Backbone, 'originalSync');
    spyOn(Backbone.DropboxDatastore, 'sync');
  });

  it('for model with dropboxDatastore returns DropboxDatastore.sync', function() {
    var model = new DropboxDatastoreModel();
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.DropboxDatastore.sync);
  });

  it('for model without dropboxDatastore returns originalSync', function() {
    var model = new Backbone.Model();
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.originalSync);
  });

  it('for model of collection with dropboxDatastore returns DropboxDatastore.sync', function() {
    var collection = new DropboxDatastoreCollection(),
        model = new Backbone.Model({}, {collection: collection});
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.DropboxDatastore.sync);
  });

  it('for collection with dropboxDatastore returns DropboxDatastore.sync', function() {
    var collection = new DropboxDatastoreCollection();
    expect(Backbone.getSyncMethod(collection)).toBe(Backbone.DropboxDatastore.sync);
  });

  it('for collection without dropboxDatastore returns originalSync', function() {
    var collection = new Backbone.Collection();
    expect(Backbone.getSyncMethod(collection)).toBe(Backbone.originalSync);
  });

});
