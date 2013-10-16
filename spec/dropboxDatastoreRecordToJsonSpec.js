describe('Backbone.DropboxDatastore.recordToJson', function() {

  var recordSpy, result;

  beforeEach(function() {
    recordSpy = jasmine.createSpyObj('record', ['getFields', 'getId']);
    recordSpy.getFields.andReturn({foo: 1, bar: 'lalala'});
    recordSpy.getId.andReturn('idMock');
    result = Backbone.DropboxDatastore.recordToJson(recordSpy);
  });

  it('call getFields of record', function() {
    expect(recordSpy.getFields).toHaveBeenCalled();
  });

  it('return result of getFields', function() {
    expect(result).toEqual({id: 'idMock', foo: 1, bar: 'lalala'});
  });

});
