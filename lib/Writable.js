var stream = require("stream")
  , util = require("util")

function Writable (el, opts) {
  opts = opts || {}
  stream.Writable.call(this, opts)
  this.el = el
  this.append = opts.append
  this._innerHTML = ""
  this.on("pipe", onPipe.bind(this))
  this.on("finish", onFinish.bind(this))
}
util.inherits(Writable, stream.Writable)

Writable.prototype._write = function (chunk, enc, cb) {
  if (this._writableState.objectMode) {
    this.el.appendChild(chunk)
  } else {
    this._innerHTML += chunk
  }
  cb()
}

function onPipe () {
  if (this._writableState.objectMode && !this.append) {
    this.el.innerHTML = ""
  }
}

function onFinish () {
  if (!this._writableState.objectMode) {
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
}

module.exports = Writable