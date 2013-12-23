describe('Backbone.DropboxDatastore auto sync', function() {

  var dropboxDatastore;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
  });

  describe('#syncCollection', function() {
    it('store passed collection to _syncCollection', function() {
      dropboxDatastore.syncCollection('collectionMock');
      expect(dropboxDatastore._syncCollection).toBe('collectionMock');
    });
  });

  describe('#_startListenToChangeRecords', function() {
    var recordsChangedSpy;
    beforeEach(function() {
      recordsChangedSpy = jasmine.createSpyObj('recordsChanged', ['addListener']);
      dropboxDatastore._startListenToChangeRecords({
        recordsChanged: recordsChangedSpy
      });
    });

    it('store callback in _changeRecordsListener', function() {
      expect(dropboxDatastore._changeRecordsListener).toEqual(jasmine.any(Function));
    });

    it('add callback as a listener to recordsChanged', function() {
      expect(recordsChangedSpy.addListener).toHaveBeenCalledWith(dropboxDatastore._changeRecordsListener);
    });
  });

  describe('#_stopListenToChangeRecords', function() {
    var recordsChangedSpy;
    describe('if listener stored', function() {
      beforeEach(function() {
        recordsChangedSpy = jasmine.createSpyObj('recordsChanged', ['removeListener']);
        dropboxDatastore._changeRecordsListener = 'listinerMock';
        dropboxDatastore._stopListenToChangeRecords({
          recordsChanged: recordsChangedSpy
        });
      });

      it('remove stored listener', function() {
        expect(dropboxDatastore._changeRecordsListener).toBeUndefined();
      });

      it('remove callback from listeners to recordsChanged', function() {
        expect(recordsChangedSpy.removeListener).toHaveBeenCalledWith('listinerMock');
      });
    });
  });

  describe('#_onChangeRecords', function() {
    describe('when there is _syncCollection', function() {
      beforeEach(function() {
        spyOn(Backbone.DropboxDatastore, 'getChangesForTable').andReturn('changesForTableMock');
        spyOn(Backbone.DropboxDatastore, 'updateCollectionWithChanges');
        dropboxDatastore._syncCollection = 'syncCollectionMock';
      });

      it('call Backbone.DropboxDatastore.getChangesForTable with changes', function() {
        dropboxDatastore._onChangeRecords('changesMock');
        expect(Backbone.DropboxDatastore.getChangesForTable).toHaveBeenCalledWith('tableName', 'changesMock');
      });

      it('deferred call Backbone.DropboxDatastore.updateCollectionWithChanges', function() {
        runs(function() {
          dropboxDatastore._onChangeRecords('changesMock');
        });

        waitsFor(function() {
          return Backbone.DropboxDatastore.updateCollectionWithChanges.callCount;
        }, 'should be called', 10);

        runs(function() {
          expect(Backbone.DropboxDatastore.updateCollectionWithChanges)
            .toHaveBeenCalledWith('syncCollectionMock', 'changesForTableMock');
        });
      });
    });
  });
});
