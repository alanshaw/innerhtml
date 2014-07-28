var test = require("tape")
  , domino = require("domino")
  , innerhtml = require("./")

// Expose to innerhtml module
var doc = global.document = domino.createWindow().document

test("replace", function (t) {
  var input = doc.createElement("div")
  var h1 = doc.createElement("h1")

  input.appendChild(h1)

  var output = doc.createElement("div")
  var h2 = doc.createElement("h2")

  output.appendChild(h2)

  doc.body.appendChild(input)
  doc.body.appendChild(output)

  var rs = innerhtml.createReadStream(input)
  var ws = innerhtml.createWriteStream(output)

  t.equal(output.childNodes.length, 1, "Output div should have just one child")

  ws.on("finish", function () {
    var nodes = output.childNodes
    t.equal(nodes.length, 1, "Output div should have just one child")
    t.equal(nodes[0].tagName, "H1", "A h1 element should have been added to the output div")

    // Clean up
    doc.body.removeChild(input)
    doc.body.removeChild(output)

    t.end()
  })

  rs.pipe(ws)
})

test("non-destructive append", function (t) {
  var input = doc.createElement("div")
  var h1 = doc.createElement("h1")

  input.appendChild(h1)

  var output = doc.createElement("div")
  var h2 = doc.createElement("h2")
  
  output.appendChild(h2)

  doc.body.appendChild(input)
  doc.body.appendChild(output)
  
  var rs = innerhtml.createReadStream(input)
  var ws = innerhtml.createWriteStream(output, {append: true})

  t.equal(output.childNodes.length, 1, "Output div should have just one child")

  ws.on("finish", function () {
    var nodes = output.childNodes
    t.equal(nodes.length, 2, "Output div should have two children")
    t.equal(nodes[0], h2, "h2 in output should not have been destroyed")
    t.equal(nodes[1].tagName, "H1", "A h1 element should have been added to the output div")
    
    // Clean up
    doc.body.removeChild(input)
    doc.body.removeChild(output)
    
    t.end()
  })

  rs.pipe(ws)
})

