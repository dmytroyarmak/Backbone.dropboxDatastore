# Backbone Dropbox Datastore Adapter v0.1.5

[![Build Status](https://secure.travis-ci.org/dmytroyarmak/Backbone.dropboxDatastore.png?branch=master)](http://travis-ci.org/dmytroyarmak/Backbone.dropboxDatastore)

Quite simply a Dropbox Datastore adapter for Backbone. It's a drop-in replacement for Backbone.Sync() to handle saving to a [Dropbox Datastore](https://www.dropbox.com/developers/datastore).

[![Gittip](http://badgr.co/gittip/dmytroyarmak.png)](https://www.gittip.com/dmytroyarmak/)

## Usage

Include Backbone.dropboxDatastore after having included Backbone.js:

```html
<script type="text/javascript" src="backbone.js"></script>
<script type="text/javascript" src="backbone.dropboxDatastore.js"></script>
```

Create your collections like so:

```javascript
window.SomeCollection = Backbone.Collection.extend({

  dropboxDatastore: new Backbone.DropboxDatastore("SomeCollection"), // Unique name within your app.

  // ... everything else is normal.

});
```
### RequireJS

Include [RequireJS](http://requirejs.org):

```html
<script type="text/javascript" src="lib/require.js"></script>
```

RequireJS config:
```javascript
require.config({
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        dropboxdatastore: "lib/backbone.dropboxDatastore"
    }
});
```

Define your collection as a module:
```javascript
define("someCollection", ["dropboxdatastore"], function() {
    var SomeCollection = Backbone.Collection.extend({
        dropboxDatastore: new Backbone.DropboxDatastore("SomeCollection") // Unique name within your app.
    });

    return new SomeCollection();
});
```

Require your collection:
```javascript
require(["someCollection"], function(someCollection) {
  // ready to use someCollection
});
```

### CommonJS

If you're using [browserify](https://github.com/substack/node-browserify).

```javascript
Backbone.DropboxDatastore = require("backbone.dropboxdatastore");
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

Copyright (c) 2010 Jerome Gravel-Niquet

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
