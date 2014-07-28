var stream = require("stream")
  , util = require("util")

function Readable (el, opts) {
  stream.Readable.call(this, opts)
  this.el = el
}
util.inherits(Readable, stream.Readable)

Readable.prototype._read = function () {
  this.push(this.el.innerHTML)
  this.push(null)
}

module.exports = Readable