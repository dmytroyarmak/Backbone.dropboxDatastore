describe('Backbone.DropboxDatastore#getTable', function() {

  var dropboxDatastore, callbackSpy, datastoreSpy;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
    callbackSpy = jasmine.createSpy('callback');
    datastoreSpy = jasmine.createSpyObj('datastore', ['getTable']);
    datastoreSpy.getTable.andReturn('tableMock');
    spyOn(Backbone.DropboxDatastore, 'getDatastore');
  });

  describe('if table is stored', function() {

    beforeEach(function() {
      dropboxDatastore.getTable(callbackSpy);
    });

    it('call getDatastore on Backbone.DropboxDatastore', function() {
      expect(Backbone.DropboxDatastore.getDatastore).toHaveBeenCalledWith(
        dropboxDatastore.datastoreId,
        jasmine.any(Function)
      );
    });

    describe('when callback called', function() {

      beforeEach(function() {
        spyOn(dropboxDatastore, '_startListenToChangeStatus');
        // Explicit call callback because we stub getDatastore
        Backbone.DropboxDatastore.getDatastore.mostRecentCall.args[1](datastoreSpy);
      });

      it('store returned Datastore', function() {
        expect(dropboxDatastore._table).toBe('tableMock');
      });

      it('call _startListenToChangeStatus with datastore', function() {
        expect(dropboxDatastore._startListenToChangeStatus).toHaveBeenCalledWith(datastoreSpy);
      });

      it('call callback with stored Datastore', function() {
        expect(callbackSpy).toHaveBeenCalledWith('tableMock');
      });

    });

  });

  describe('if table is not stored', function() {

    beforeEach(function() {
      dropboxDatastore._table = 'storedTableMock';
      runs(function() {
        dropboxDatastore.getTable(callbackSpy);
      });
      waitsFor(function() {
        return callbackSpy.calls.length;
      }, 'The callback should be called.', 10);
    });

    it('do not call getDatastore on Backbone.DropboxDatastore', function() {
      expect(Backbone.DropboxDatastore.getDatastore).not.toHaveBeenCalled();
    });

    it('call callback with stored Datastore', function() {
      expect(callbackSpy).toHaveBeenCalledWith('storedTableMock');
    });

  });

});
