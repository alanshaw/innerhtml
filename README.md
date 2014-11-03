# innerhtml [![Build Status](https://img.shields.io/travis/alanshaw/innerhtml/master.svg?style=flat)](https://travis-ci.org/alanshaw/innerhtml) [![Dependency Status](https://david-dm.org/alanshaw/innerhtml.svg?style=flat)](https://david-dm.org/alanshaw/innerhtml)

Stream content to/from a DOM node

## Example

Copy content from one DOM node to another:

### index.html

```html
<!doctype html>
<div id="input">
  <h1>Lorem Ipsum</p>
  <p>Pellentesque habitant morbi tristique senectus.</p>
</div>
<div id="output"></div>
<script src="bundle.js"></script>
```

### main.js

```js
var innerhtml = require("innerhtml")
  , input = document.getElementById("input")
  , output = document.getElementById("output")

innerhtml.createReadStream(input).pipe(innerhtml.createWriteStream(output))
```

Finally, use [browserify](http://browserify.org/) to create `bundle.js`:

```sh
npm install -g browserify
npm install innerhtml
browserify main.js > bundle.js
```

## API

### innerhtml.createReadStream(element [, options])

Create a new readable stream whose source is the passed DOM element. If no options are passed, the readable stream will emit `element`'s `innerHTML`.

#### options.objectMode

Setting this to true will cause the readable stream to emit a cloned node for each of `element`'s `childNodes`.

#### options.remove

Setting this to true will cause the readable stream to empty the contents of `element` by setting it's `innerHTML` to "" after it has been emitted.

If `objectMode` is also set to true, the readable stream will remove and emit each of `element`'s `childNodes`.

### innerhtml.createWriteStream(element [, options])

Create a new writable stream whose destination is the passed DOM element. If no options are passed, the writable stream will replace the `element`'s `innerHTML` with the content piped to it. 

#### options.objectMode

Setting this to true will cause the writable stream to expect DOM nodes to be written to it.

#### options.append

Setting this to true will cause the writable stream to append to the existing contents of the node instead of replacing it.

#### options.clone

When `objectMode` is set to true, setting this option to true causes the writeable stream to clone the node written to it before it is appended to `element`. It allows a readable stream to pipe to multiple destinations when in `objectMode`.
