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

function Writable (el, opts) {
  opts = opts || {}
  stream.Writable.call(this, opts)
  this.el = el
  this.append = opts.append
  this._innerHTML = ""
  this.on("finish", onFinish.bind(this))
}
util.inherits(Writable, stream.Writable)

Writable.prototype._write = function (chunk, enc, cb) {
  this._innerHTML = this._innerHTML + chunk
  cb()
}

function onFinish () {
  if (this.append) {
    this.el.innerHTML = this.el.innerHTML + this._innerHTML
  } else {
    this.el.innerHTML = this._innerHTML
  }
  this._innerHTML = ""
}

module.exports.createReadStream = function (el, opts) {
  return new Readable(el, opts)
}

module.exports.createWriteStream = function (el, opts) {
  return new Writable(el, opts)
}