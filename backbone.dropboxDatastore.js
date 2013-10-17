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
  Backbone.DropboxDatastore = function(name, options) {
    options = options || {};
    this.name = name;
    this.datastoreId = options.datastoreId || 'default';
  };

  // Instance methods of DropboxDatastore
  _.extend(Backbone.DropboxDatastore.prototype, Backbone.Events, {

    // Insert new record to *Dropbox.Datastore.Table*.
    create: function(model, callback) {
      this.getTable(function(table) {
        var record = table.insert(model.toJSON());
        callback(Backbone.DropboxDatastore.recordToJson(record));
      });
    },

    // Update existing record in *Dropbox.Datastore.Table*.
    update: function(model, callback) {
      this.getTable(_.bind(function(table) {
        var record = this._findRecordSync(table, model);
        if (record) {
          record.update(model.toJSON());
        } else {
          record = table.insert(model.toJSON());
        }
        callback(Backbone.DropboxDatastore.recordToJson(record));
      }, this));
    },

    // Find record from *Dropbox.Datastore.Table* by id.
    find: function(model, callback) {
      this.getTable(_.bind(function(table) {
        var record = this._findRecordSync(table, model);
        if (record) {
          callback(Backbone.DropboxDatastore.recordToJson(record));
        } else {
          throw new Error('Record not found');
        }
      }, this));
    },

    // Find all records currently in *Dropbox.Datastore.Table*.
    findAll: function(callback) {
      this.getTable(function(table) {
        var result = _.map(table.query(), Backbone.DropboxDatastore.recordToJson);
        callback(result);
      });
    },

    // Remove record from *Dropbox.Datastore.Table*.
    destroy: function(model, callback) {
      this.getTable(_.bind(function(table) {
        var record = this._findRecordSync(table, model);
        if (record) {
          record.deleteRecord();
        }
        callback({});
      }, this));
    },

    // lazy table getter
    getTable: function(callback) {
      var onGetDatastore;

      if (this._table) {
        // To be consistent to async nature of this method defers invoking
        // the function using Underscore defer
        _.defer(callback, this._table);
      } else {
        Backbone.DropboxDatastore.getDatastore(this.datastoreId, _.bind(function(datastore) {
          this._table = datastore.getTable(this.name);
          this._startListenToChangeStatus(datastore);
          callback(this._table);
        }, this));
      }
    },

    getStatus: function() {
      if (this._table && this._table._datastore.getSyncStatus().uploading) {
        return 'uploading';
      } else {
        return 'synced';
      }
    },

    close: function() {
      if (this._table) {
        this._stopListenToChangeStatus(this._table._datastore);
      }
    },

    _findRecordSync: function(table, model) {
        var params = {},
            record;
        if (model.isNew()) {
          throw new Error('Cannot fetch data for model without id');
        } else {
          if (model.idAttribute === 'id') {
            record = table.get(model.id);
          } else {
            params[model.idAttribute] = model.id;
            record = _.first(table.query(params));
          }

          return record;
        }
    },

    _startListenToChangeStatus: function(datastore) {
      this._changeStatusListener = _.bind(this._onChangeStatus, this);
      datastore.syncStatusChanged.addListener(this._changeStatusListener);
    },

    _stopListenToChangeStatus: function(datastore) {
      if (this._changeStatusListener) {
        datastore.syncStatusChanged.removeListener(this._changeStatusListener);
        delete this._changeStatusListener;
      }
    },

    _onChangeStatus: function() {
      this.trigger('change:status', this.getStatus(), this);
    }
  });

  // Static methods of DropboxDatastore
  _.extend(Backbone.DropboxDatastore, {

    _datastores: {},

    getDatastore: function(datastoreId, callback) {
      var datastore = this._datastores[datastoreId],
          onOpenDatastore;

      if(datastore) {

        // To be consistent to async nature of this method defers invoking
        // of the function using Underscore defer
        _.defer(callback, datastore);
      } else {
        // Bind and partial applying _onOpenDatastore by callback
        onOpenDatastore = _.bind(this._onOpenDatastore, this, datastoreId, callback);

        // we can open only one instance of Datastore simultaneously
        this.getDatastoreManager()._getOrCreateDatastoreByDsid(datastoreId, onOpenDatastore);
      }
    },

    _onOpenDatastore: function(datastoreId, callback, error, datastore) {
      if (error) {
        throw new Error('Error on _getOrCreateDatastoreByDsid: ' + error.responseText);
      }
      // cache opened datastore
      this._datastores[datastoreId] = datastore;
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
      return _.extend(record.getFields(), {
        id: record.getId()
      });
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
          if (model instanceof Backbone.Collection) {
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
