(function (root, factory) {
  'use strict';

  if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = factory(require('underscore'), require('backbone'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['underscore','backbone'], function(_, Backbone) {
      // Use global variables if the locals are undefined.
      return factory(_ || root._, Backbone || root.Backbone);
    });
  } else {
    // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
    factory(_, Backbone);
  }
}(this, function(_, Backbone) {
  'use strict';

  // A simple module to replace `Backbone.sync` to store data
  // in Dropbox Datastore.

  // Hold reference to Underscore.js and Backbone.js in the closure in order
  // to make things work even if they are removed from the global namespace

  // Our Store is represented by a single Dropbox.Datastore.Table. Create it
  // with a meaningful name. This name should be unique per application.
  Backbone.DropboxDatastore = function(name) {
    this.name = name;
  };

  // Instance methods of DropboxDatastore
  _.extend(Backbone.DropboxDatastore.prototype, {

    // Save the current state of the **Store** to *Dropbox Datastore*.
    save: function(model) {
    },

    // Add a model to *Dropbox Datastore*.
    create: function(model) {
    },

    // Update a model in *Dropbox Datastore*.
    update: function(model) {
    },

    // Retrieve a model from *Dropbox Datastore* by id.
    find: function(model) {
    },

    // Return the array of all models currently in table.
    findAll: function(callback) {
      this.getTable(function(table) {
        var result = _.map(table.query(), Backbone.DropboxDatastore.recordToJson);
        callback(result);
      });
    },

    // Delete a model from *Dropbox Datastore*.
    destroy: function(model) {
    },

    // lazy table getter
    getTable: function(callback) {
      var onGetDatastore;

      if (this._table) {
        // To be consistent to async nature of this method defers invoking
        // the function using Underscore defer
        _.defer(callback, this._table);
      } else {
        // Bind and partial applying _onGetDatastore by callback
        onGetDatastore = _.bind(this._onGetDatastore, this, callback);
        Backbone.DropboxDatastore.getDatastore(onGetDatastore);
      }
    },

    _onGetDatastore: function(callback, datastore) {
      this._table = datastore.getTable(this.name);
      callback(this._table);
    }
  });

  // Static methods of DropboxDatastore
  _.extend(Backbone.DropboxDatastore, {
    getDatastore: function(callback) {
      var onOpenDefaultDatastore;

      if (this._datastore) {
        // To be consistent to async nature of this method defers invoking
        // the function using Underscore defer
        _.defer(callback, this._datastore);
      } else {
        // Bind and partial applying _onOpenDefaultDatastore by callback
        onOpenDefaultDatastore = _.bind(this._onOpenDefaultDatastore, this, callback);

        // we can open only one instance of Datastore simultaneously
        this.getDatastoreManager().openDefaultDatastore(onOpenDefaultDatastore);
      }
    },

    _onOpenDefaultDatastore: function(callback, error, datastore) {
      if (error) {
        throw new Error('Error on openDefaultDatastore: ' + error.responseText);
      }
      // cache opened datastore
      this._datastore = datastore;
      callback(datastore);
    },

    getDatastoreManager: function() {
      return this.getDropboxClient().getDatastoreManager();
    },

    getDropboxClient: function() {
      var client = Backbone.DropboxDatastore.client;
      if (!client) {
        throw new Error('Client should be defined for Backbone.DropboxDatastore');
      }
      if (!client.isAuthenticated()) {
        throw new Error('Client should be authenticated for Backbone.DropboxDatastore');
      }
      return client;
    },

    // Using to convert returned Dropbox Datastore records to JSON
    recordToJson: function(record) {
      return record.getFields();
    },

    // dropboxDatastoreSync delegate to the model or collection's
    // *dropboxDatastore* property, which should be an instance of `Backbone.DropboxDatastore`.
    sync: function(method, model, options) {
      var store = model.dropboxDatastore || model.collection.dropboxDatastore,
          syncDfd = Backbone.$.Deferred && Backbone.$.Deferred(), //If $ is having Deferred - use it.
          syncCallback = _.partial(Backbone.DropboxDatastore._syncCallback, model, options, syncDfd); // partial apply callback with  some attributes

      switch (method) {
        case 'read':
          // check if it is a collection or model
          if (_.isUndefined(model.id)) {
            store.findAll(syncCallback);
          } else {
            store.find(model, syncCallback);
          }
          break;
        case 'create':
          store.create(model, syncCallback);
          break;
        case 'update':
          store.update(model, syncCallback);
          break;
        case 'delete':
          store.destroy(model, syncCallback);
          break;
      }

      return syncDfd && syncDfd.promise();
    },

    _syncCallback: function(model, options, syncDfd, resp) {
      if (options && options.success) {
        if (Backbone.VERSION === '0.9.10') {
          options.success(model, resp, options);
        } else {
          options.success(resp);
        }
      }
      if (syncDfd) {
        syncDfd.resolve(resp);
      }
    },

    _callCallbackIfExists: function(name, model, resp, options) {

    }
  });

  Backbone.originalSync = Backbone.sync;

  Backbone.getSyncMethod = function(model) {
    if(model.dropboxDatastore || (model.collection && model.collection.dropboxDatastore)) {
      return Backbone.DropboxDatastore.sync;
    } else {
      return Backbone.originalSync;
    }
  };

  // Override 'Backbone.sync' to default to dropboxDatastoreSync,
  // the original 'Backbone.sync' is still available in 'Backbone.originalSync'
  Backbone.sync = function(method, model, options) {
    return Backbone.getSyncMethod(model).call(this, method, model, options);
  };

  return Backbone.DropboxDatastore;
}));
