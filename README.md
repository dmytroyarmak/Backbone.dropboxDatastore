# Backbone Dropbox Datastore Adapter v0.4.0

[![Build Status](https://secure.travis-ci.org/dmytroyarmak/Backbone.dropboxDatastore.png?branch=master)](http://travis-ci.org/dmytroyarmak/Backbone.dropboxDatastore)

Quite simply a Dropbox Datastore adapter for Backbone. It's a drop-in replacement for Backbone.Sync() to handle saving to a [Dropbox Datastore](https://www.dropbox.com/developers/datastore).

[![Gittip](http://badgr.co/gittip/dmytroyarmak.png)](https://www.gittip.com/dmytroyarmak/)

## Usage

You need to have registered application with an OAuth redirect URI registered on the [App Console](https://www.dropbox.com/developers/apps) before using the Dropbox Datastore API.

Include [Datastore API SDKs](https://www.dropbox.com/developers/datastore/sdks/js) and Backbone.dropboxDatastore after having included Backbone.js:

```html
<script type="text/javascript" src="backbone.js"></script>
<script type="text/javascript" src="backbone.dropboxDatastore.js"></script>
<script type="text/javascript" src="https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest.js"></script>
```

To start using the Datastore API, you'll need to create a Client object. This object lets you link to a Dropbox user's account, which is the first step to working with data on their behalf.

You'll want to create the client object as soon as your app has loaded. Depending on your JavaScript framework, this can be done in a variety of different ways. For example, in jQuery, you would use the $() function.

After authentication you should set client object to Backbone.DropboxDatastore.client property.

*Be sure to replace APP_KEY with the real value for your app.*

```javascript
var client = new Dropbox.Client({key: APP_KEY});

// Try to finish OAuth authorization.
client.authenticate({interactive: false});

// Redirect to Dropbox to authenticate if client isn't authenticated
if (!client.isAuthenticated()) client.authenticate();

// Set client for Backbone.DropboxDatastore to work with Dropbox
Backbone.DropboxDatastore.client = client;

// Client is authenticated and set for Backbone.DropboxDatastore.
// You can use CRUD methods of collection with DropboxDatastore
```

Create your collections like so:

```javascript
window.SomeCollection = Backbone.Collection.extend({

  dropboxDatastore: new Backbone.DropboxDatastore('SomeCollection'), // Unique name within your app.

  // ... everything else is normal.

});
```

For more details how Dropbox Datastore API works read tutorial: [Using the Datastore API in JavaScript](https://www.dropbox.com/developers/datastore/tutorial/js)

### Custom Datastore ID

By default collections store on default Datastore. If you want use specific datastore pass options object as second attribute to Backbone.DropboxDatastore with property datastoreId:

```javascript
window.SomeCollection = Backbone.Collection.extend({

  dropboxDatastore: new Backbone.DropboxDatastore('SomeCollection', {
    datastoreId: 'MyCustomDatastore'
  }),

  // ... everything else is normal.

});
```

### Checking the datastore sync status

When your app makes a change to a datastore, that change is queued up locally and sent to Dropbox asynchronously. This means that there's a period of time between when a change is made and when that change has been uploaded to Dropbox.

To get current status of datastore you can just call getStatus() on dropboxDatastore object that returns 'uploading' or 'synced':

```javascript
var currentStatus = myCollection.dropboxDatastore.getStatus();

if (currentStatus === 'uploading') {
  // There are data that are not saved to Dropbox
} else if (currentStatus === 'synced') {
  // All data are saved to Dropbox
}
````

Also you can listen to change status event on dropboxDatastore:

```javascript
myCollection.dropboxDatastore.on('change:status', function(status, dropboxDatastore){
  // do something...
});

````

Read more: [Checking the datastore sync status in JavaScript](https://www.dropbox.com/developers/blog/61/checking-the-datastore-sync-status-in-javascript).

### Closing dropboxDatastore

To fully removing created dropboxDatastore you should call close method on dropboxDatastore.

```javascript
myCollection.dropboxDatastore.close();
````

### RequireJS

Include [RequireJS](http://requirejs.org):

```html
<script type="text/javascript" src="lib/require.js"></script>
```

RequireJS config:
```javascript
require.config({
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        dropbox: 'https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest',
        dropboxdatastore: 'lib/backbone.dropboxDatastore'
    }
});
```

*Create client, authorize it and set to Backbone.DropboxDatastore.client as in previous section.*

Define your collection as a module:
```javascript
define('someCollection', ['dropboxdatastore'], function() {
    var SomeCollection = Backbone.Collection.extend({
        dropboxDatastore: new Backbone.DropboxDatastore('SomeCollection') // Unique name within your app.
    });

    return new SomeCollection();
});
```

Require your collection:
```javascript
require(['someCollection'], function(someCollection) {
  // ready to use someCollection
});
```

### CommonJS

If you're using [browserify](https://github.com/substack/node-browserify).

```javascript
Backbone.DropboxDatastore = require('backbone.dropboxdatastore');
```

## Contributing

You'll need node and to `npm install` before being able to run the minification script.

Also to install dependencies for tests you need to `npm install -g bower` and then `bower install`.

1. Fork;
2. Write code, with tests;
4. Run tests with `npm test`
5. Create a pull request.

Have fun!

## License

Licensed under MIT license

Copyright (c) 2013 Dmytro Yarmak

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
