describe('Backbone.DropboxDatastore.getChangesForTable', function() {
  var result, changesSpy;

  function createRecordSpy (id, deleted) {
    var record = jasmine.createSpyObj('record ' + id, ['isDeleted', 'getId']);
    record.getId.andReturn(id);
    record.isDeleted.andReturn(deleted);
    return record;
  }

  beforeEach(function() {
    spyOn(Backbone.DropboxDatastore, 'recordToJson').andCallFake(function(record) {
      return 'json for record ' + record.getId();
    });

    changesSpy = jasmine.createSpyObj('changes', ['affectedRecordsForTable']);
    changesSpy.affectedRecordsForTable.andReturn([
      createRecordSpy(1, true),
      createRecordSpy(2, false),
      createRecordSpy(3, true),
      createRecordSpy(4, false)
    ]);

    result = Backbone.DropboxDatastore.getChangesForTable('tableName', changesSpy);
  });

  it('return object where toRemove contains ids of all affectedRecordsForTable that isDeleted', function() {
    expect(result.toRemove).toEqual([1, 3]);
  });

  it('return object where toAdd contains json of all affectedRecordsForTable that is not deleted', function() {
    expect(result.toAdd).toEqual(['json for record 2', 'json for record 4']);
  });
});
