var stream = require("stream")
  , inherits = require("inherits")

function Readable (el, opts) {
  opts = opts || {}
  stream.Readable.call(this, opts)
  this.remove = opts.remove
  this._currentNodeIndex = 0
  this.el = el
  this.on("end", onEnd.bind(this))
}
inherits(Readable, stream.Readable)

Readable.prototype._read = function () {
  if (this._readableState.objectMode) {
    var node = null

    if (this.remove) {
      if (!this.el.hasChildNodes()) return this.push(null)

      node = this.el.childNodes[0]

      while (this.push(node)) {
        this.el.removeChild(node)

        if (!this.el.hasChildNodes()) return this.push(null)

        node = this.el.childNodes[0]
      }
    } else {
      node = this.el.childNodes[this._currentNodeIndex]

      if (!node) return this.push(null)

      while (this.push(node.cloneNode(true))) {
        this._currentNodeIndex++

        node = this.el.childNodes[this._currentNodeIndex]

        if (!node) return this.push(null)
      }

      this._currentNodeIndex++
    }
  } else {
    this.push(this.el.innerHTML)
    if (this.remove) this.el.innerHTML = ""
    this.push(null)
  }
}

function onEnd () {
  this._currentNodeIndex = 0
}

module.exports = Readable