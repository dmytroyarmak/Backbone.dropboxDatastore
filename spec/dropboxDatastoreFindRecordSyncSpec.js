describe('Backbone.DropboxDatastore#_findRecordSync', function() {

  var dropboxDatastore, modelSpy, tableSpy, result;

  beforeEach(function() {
    dropboxDatastore = new Backbone.DropboxDatastore('tableName');
  });

  describe('when model have id', function() {

    beforeEach(function() {
      modelSpy = jasmine.createSpyObj('model', ['isNew']);
      modelSpy.isNew.andReturn(false);
      modelSpy.id = 'idMock';
    });

    describe('with idAttribute equal "id"', function() {

      beforeEach(function() {
        modelSpy.idAttribute = 'id';
        tableSpy = jasmine.createSpyObj('table', ['get']);
        tableSpy.get.andReturn('recordSpy');

        result = dropboxDatastore._findRecordSync(tableSpy, modelSpy);
      });

      it('call get on table', function() {
        expect(tableSpy.get).toHaveBeenCalledWith('idMock');
      });

      it('return found record', function() {
        expect(result).toBe('recordSpy');
      });

    });

    describe('with idAttribute not equal "id"', function() {

      beforeEach(function() {
        modelSpy.idAttribute = 'idAttributeMock';
        tableSpy = jasmine.createSpyObj('table', ['query']);
        tableSpy.query.andReturn(['recordSpy']);

        result = dropboxDatastore._findRecordSync(tableSpy, modelSpy);
      });

      it('call query on table', function() {
        expect(tableSpy.query).toHaveBeenCalledWith({idAttributeMock: 'idMock'});
      });

      it('return found record', function() {
        expect(result).toBe('recordSpy');
      });

    });

  });

  describe('when model does not have id', function() {
    beforeEach(function() {
      modelSpy = jasmine.createSpyObj('model', ['isNew']);
      modelSpy.isNew.andReturn(true);
    });

    it('throw error', function() {
      expect(function() {
        dropboxDatastore._findRecordSync(tableSpy, modelSpy);
      }).toThrow();
    });

  });

});
