# innerhtml [![Build Status](https://img.shields.io/travis/alanshaw/innerhtml/master.svg)](https://travis-ci.org/alanshaw/innerhtml) [![devDependency Status](https://david-dm.org/alanshaw/innerhtml/dev-status.svg)](https://david-dm.org/alanshaw/innerhtml#info=devDependencies)

Stream content to/from a DOM node

## Example

Copy content from one DOM node to another:

### index.html

```html
<!doctype html>
<div id="input">
  <h1>Lorem Ipsum</p>
  <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
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
