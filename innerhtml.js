var Readable = require("./lib/Readable")
  , Writable = require("./lib/Writable")

module.exports.createReadStream = function (el, opts) {
  return new Readable(el, opts)
}

module.exports.createWriteStream = function (el, opts) {
  return new Writable(el, opts)
}

module.exports.Readable = Readable
module.exports.Writable = Writable