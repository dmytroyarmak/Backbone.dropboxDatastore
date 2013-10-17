describe('Backbone.DropboxDatastore status events', function() {

  var dropboxDatastore;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
  });

  describe('#_startListenToChangeStatus', function() {
    var syncStatusChangedSpy;
    beforeEach(function() {
      syncStatusChangedSpy = jasmine.createSpyObj('syncStatusChanged', ['addListener']);
      dropboxDatastore._startListenToChangeStatus({
        syncStatusChanged: syncStatusChangedSpy
      });
    });

    it('store callback in _changeStatusListener', function() {
      expect(dropboxDatastore._changeStatusListener).toEqual(jasmine.any(Function));
    });
    it('add callback as a listener to syncStatusChanged', function() {
      expect(syncStatusChangedSpy.addListener).toHaveBeenCalledWith(dropboxDatastore._changeStatusListener);
    });
  });

  describe('#_stopListenToChangeStatus', function() {
    var syncStatusChangedSpy;
    describe('if listener stored', function() {
      beforeEach(function() {
        syncStatusChangedSpy = jasmine.createSpyObj('syncStatusChanged', ['removeListener']);
        dropboxDatastore._changeStatusListener = 'listinerMock';
        dropboxDatastore._stopListenToChangeStatus({
          syncStatusChanged: syncStatusChangedSpy
        });
      });

      it('remove stored listener', function() {
        expect(dropboxDatastore._changeStatusListener).toBeUndefined();
      });

      it('remove callback from listeners to syncStatusChanged', function() {
        expect(syncStatusChangedSpy.removeListener).toHaveBeenCalledWith('listinerMock');
      });
    });
  });

  describe('#_onChangeStatus', function() {
    beforeEach(function() {
      spyOn(dropboxDatastore, 'trigger');
      spyOn(dropboxDatastore, 'getStatus').andReturn('statusMock');
      dropboxDatastore._onChangeStatus();
    });
    it('trigger event change:status on dropboxDatastore', function() {
      expect(dropboxDatastore.trigger).toHaveBeenCalledWith('change:status', 'statusMock', dropboxDatastore);
    });
  });
});
