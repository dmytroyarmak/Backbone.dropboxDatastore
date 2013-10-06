xdescribe("Backbone.dropboxDatastore", function(){
  describe("on a Collection", function(){
    it("should use `dropboxDatastore`", function(){});
    it("should initially be empty", function(){});

    describe("create", function(){
      it("should have 1 model", function(){});
      it("should have a populated model", function(){});
      it("should have assigned an `id` to the model", function(){});
    });

    describe("get (by `id`)", function(){
      it("should find the model with its `id`", function(){});
    });

    describe("instances", function(){

      describe("save", function(){
        it("should persist the changes", function(){});

        describe("with a new `id`", function(){
          it("should have a new `id`", function(){});
          it("should have kept its old properties", function(){});
        });
      });

      describe("destroy", function(){
        it("should have removed all items from the collection", function(){});
        it("should have removed all items from the store", function(){});
      });

      describe("with a different `idAttribute`", function(){
        it("should have used the custom `idAttribute`", function(){});
      });
    });
  });

  describe("on a Model", function(){
    it("should use `localSync`", function(){});

    describe("fetch", function(){
      it('should fire sync event on fetch', function() {});
    });

    describe("save", function(){
      it("should be saved in the store", function(){});

      describe("with new attributes", function(){
        it("should persist the changes", function(){});
      });

      describe('fires events', function(){
        it('should fire sync event on save', function() {});
      });
    });

    describe("destroy", function(){
      it("should have removed the instance from the store", function(){});
    });
  });

  describe("Error handling", function(){});
});

describe("Without Backbone.dropboxDatastore", function(){

  describe("on a Collection", function(){
    var Collection = Backbone.Collection.extend()
      , collection = new Collection();

    it("should use `ajaxSync`", function(){
      assert.equal(Backbone.getSyncMethod(collection), Backbone.ajaxSync);
    });
  });

  describe("on a Model", function(){
    var Model = Backbone.Model.extend()
      , model = new Model();

    it("should use `ajaxSync`", function(){
      assert.equal(Backbone.getSyncMethod(model), Backbone.ajaxSync);
    });
  });

});


// For some reason this is not ran when viewed in a browser
// but it is ran when using `mocha-phantomjs`.
describe("AMD", function(){

  require.config({
    paths: {
      jquery: "support/jquery",
      underscore: "support/underscore",
      backbone: "support/backbone",
      dropboxDatastore: "../backbone.dropboxDatastore"
    }
  });

  var DropboxDatastore;

  before(function(done){
    require(["dropboxDatastore"], function(LS){
      DropboxDatastore = LS;
      done()
    });
  });

  it("should be the same as the non-amd usage", function(){
    assert.equal(Backbone.DropboxDatastore, DropboxDatastore)
  });

});
