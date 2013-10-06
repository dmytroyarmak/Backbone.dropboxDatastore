describe('Backbone.dropboxDatastore in CommonJS environment', function() {

  var DropboxDatastore = require('../backbone.dropboxDatastore');
  var Backbone = require('backbone');

  it('should be the same as the non-CommonJS usage', function(){
    assert.equal(Backbone.DropboxDatastore, DropboxDatastore);
  });
});
