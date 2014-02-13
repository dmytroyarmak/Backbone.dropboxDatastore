describe('Backbone.sync', function() {
  var DropboxDatastoreModel = Backbone.Model.extend({
        dropboxDatastore: 'dropboxDatastoreMock'
      }),
      DropboxDatastoreCollection = Backbone.Collection.extend({
        dropboxDatastore: 'dropboxDatastoreMock'
      });

  beforeEach(function() {
    spyOn(Backbone, 'originalSync').andReturn('originalSyncResultMock');
    spyOn(Backbone.DropboxDatastore, 'sync').andReturn('syncResultMock');
  });

  it('for model with dropboxDatastore returns DropboxDatastore.sync', function() {
    var model = new DropboxDatastoreModel();
    expect(Backbone.sync('methodMock', model, 'optionsMock')).toBe('syncResultMock');
    expect(Backbone.DropboxDatastore.sync).toHaveBeenCalledWith('methodMock', model, 'optionsMock');
  });

  it('for model without dropboxDatastore returns originalSync', function() {
    var model = new Backbone.Model();
    expect(Backbone.sync('methodMock', model, 'optionsMock')).toBe('originalSyncResultMock');
    expect(Backbone.originalSync).toHaveBeenCalledWith('methodMock', model, 'optionsMock');
  });

  it('for model of collection with dropboxDatastore returns DropboxDatastore.sync', function() {
    var collection = new DropboxDatastoreCollection(),
        model = new Backbone.Model({}, {collection: collection});
    expect(Backbone.sync('methodMock', model, 'optionsMock')).toBe('syncResultMock');
    expect(Backbone.DropboxDatastore.sync).toHaveBeenCalledWith('methodMock', model, 'optionsMock');
  });

  it('for collection with dropboxDatastore returns DropboxDatastore.sync', function() {
    var collection = new DropboxDatastoreCollection();
    expect(Backbone.sync('methodMock', collection, 'optionsMock')).toBe('syncResultMock');
    expect(Backbone.DropboxDatastore.sync).toHaveBeenCalledWith('methodMock', collection, 'optionsMock');
  });

  it('for collection without dropboxDatastore returns originalSync', function() {
    var collection = new Backbone.Collection();
    expect(Backbone.sync('methodMock', collection, 'optionsMock')).toBe('originalSyncResultMock');
    expect(Backbone.originalSync).toHaveBeenCalledWith('methodMock', collection, 'optionsMock');
  });
});
