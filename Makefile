bin = ./node_modules/.bin

test: test-globals-amd test-commonjs

test-globals-amd:
	$(bin)/mocha-phantomjs ./spec/runner.html

test-commonjs: install ./spec/dropboxDatastore_commonjs_spec.bundled.js
	$(bin)/mocha-phantomjs ./spec/runner_commonjs.html

link install:
	@npm $@

clean:
	rm -rf node_modules ./spec/dropboxDatastore_commonjs_spec.bundled.js

./spec/dropboxDatastore_commonjs_spec.bundled.js: ./spec/dropboxDatastore_commonjs_spec.js
	$(bin)/browserify -e $< -o $@

minify:
	$(bin)/uglifyjs -o backbone.dropboxDatastore-min.js backbone.dropboxDatastore.js

# Get version number from package.json, need this for tagging.
version = $(shell node -e "console.log(JSON.parse(require('fs').readFileSync('package.json')).version)")

# npm publish, public-docs and tag
publish :
	npm publish
	git push
	git tag v$(version)
	git push --tags origin master
