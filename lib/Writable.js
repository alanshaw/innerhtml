var stream = require("stream")
  , util = require("util")

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
    var div = document.createElement("div")
    div.innerHTML = this._innerHTML

    if (div.hasChildNodes()) {
      var frag = document.createDocumentFragment()
      for (var i = 0; i < div.childNodes.length; i++) {
        frag.appendChild(div.childNodes[i])
      }
      this.el.appendChild(frag)
    }
  } else {
    this.el.innerHTML = this._innerHTML
  }
  this._innerHTML = ""
}

module.exports = Writable