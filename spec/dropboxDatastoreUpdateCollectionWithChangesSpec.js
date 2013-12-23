describe('Backbone.DropboxDatastore.updateCollectionWithChanges', function() {
  var result, syncCollectionSpy;

  beforeEach(function() {
    var changesMock = {
          toAdd: 'toAddMock',
          toRemove: 'toRemoveMock'
        };

    syncCollectionSpy = jasmine.createSpyObj('syncCollection', ['add', 'remove']);

    result = Backbone.DropboxDatastore.updateCollectionWithChanges(syncCollectionSpy, changesMock);
  });

  it('it add records form toAdd', function() {
    expect(syncCollectionSpy.add).toHaveBeenCalledWith('toAddMock', {merge: true});
  });

  it('it remove records form toRemove', function() {
    expect(syncCollectionSpy.remove).toHaveBeenCalledWith('toRemoveMock');
  });
});
