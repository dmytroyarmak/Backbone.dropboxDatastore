describe('Backbone.sync', function() {
  var syncSpy;

  beforeEach(function() {
    syncSpy = jasmine.createSpy('syncSpy');
    spyOn(Backbone, 'getSyncMethod').andReturn(syncSpy);
  });

  it('delegate call to result of Backbone.getSyncMethod', function() {
    Backbone.sync('methodMock', 'modelMock', 'optionsMock');

    expect(Backbone.getSyncMethod).toHaveBeenCalledWith('modelMock');
    expect(syncSpy).toHaveBeenCalledWith('methodMock', 'modelMock', 'optionsMock');
  });
});

describe('Backbone.getSyncMethod', function(){
  var DropboxDatastoreModel = Backbone.Model.extend({
        dropboxDatastore: 'dropboxDatastoreMock'
      }),
      DropboxDatastoreCollection = Backbone.Collection.extend({
        dropboxDatastore: 'dropboxDatastoreMock'
      });

  beforeEach(function() {
    spyOn(Backbone, 'ajaxSync');
    spyOn(Backbone, 'dropboxDatastoreSync');
  });

  it('for model with dropboxDatastore returns dropboxDatastoreSync', function() {
    var model = new DropboxDatastoreModel();
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.dropboxDatastoreSync);
  });

  it('for model without dropboxDatastore returns ajaxSync', function() {
    var model = new Backbone.Model();
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.ajaxSync);
  });

  it('for model of collection with dropboxDatastore returns dropboxDatastoreSync', function() {
    var collection = new DropboxDatastoreCollection(),
        model = new Backbone.Model({}, {collection: collection});
    expect(Backbone.getSyncMethod(model)).toBe(Backbone.dropboxDatastoreSync);
  });

  it('for collection with dropboxDatastore returns dropboxDatastoreSync', function() {
    var collection = new DropboxDatastoreCollection();
    expect(Backbone.getSyncMethod(collection)).toBe(Backbone.dropboxDatastoreSync);
  });

  it('for collection without dropboxDatastore returns ajaxSync', function() {
    var collection = new Backbone.Collection();
    expect(Backbone.getSyncMethod(collection)).toBe(Backbone.ajaxSync);
  });
});
