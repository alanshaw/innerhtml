var test = require("tape")
  , domino = require("domino")
  , innerhtml = require("./")

// Expose to innerhtml module
var doc = global.document = domino.createWindow().document

test("copy", function (t) {
  var input = doc.createElement("div")
  var h1 = doc.createElement("h1")

  input.appendChild(h1)

  var output = doc.createElement("div")

  doc.body.appendChild(input)
  doc.body.appendChild(output)

  var rs = innerhtml.createReadStream(input)
  var ws = innerhtml.createWriteStream(output)

  t.equal(output.childNodes.length, 0, "Output div should have zero children")

  ws.on("finish", function () {
    var nodes = output.childNodes
    t.equal(nodes.length, 1, "Output div should have just one child")
    t.equal(nodes[0].tagName, "H1", "A h1 element should have been added to the output div")

    nodes = input.childNodes
    t.equal(nodes.length, 1, "Input div should still have just one child")
    t.equal(nodes[0], h1, "h1 element should still be in the input div")

    // Clean up
    doc.body.removeChild(input)
    doc.body.removeChild(output)

    t.end()
  })

  rs.pipe(ws)
})

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

test("copy objectMode", function (t) {
  var input = doc.createElement("div")
  var h1 = doc.createElement("h1")

  input.appendChild(h1)

  var output = doc.createElement("div")

  doc.body.appendChild(input)
  doc.body.appendChild(output)

  var rs = innerhtml.createReadStream(input, {objectMode: true})
  var ws = innerhtml.createWriteStream(output, {objectMode: true})

  t.equal(output.childNodes.length, 0, "Output div should have zero children")

  ws.on("finish", function () {
    var nodes = output.childNodes
    t.equal(nodes.length, 1, "Output div should have just one child")
    t.equal(nodes[0].tagName, "H1", "A h1 element should have been added to the output div")
    t.notEqual(nodes[0], h1, "h1 element in output div should not be same as h1 element in input div")

    nodes = input.childNodes
    t.equal(nodes.length, 1, "Input div should still have just one child")
    t.equal(nodes[0], h1, "h1 element should still be in the input div")

    // Clean up
    doc.body.removeChild(input)
    doc.body.removeChild(output)

    t.end()
  })

  rs.pipe(ws)
})

test("move objectMode", function (t) {
  var input = doc.createElement("div")
  var h1 = doc.createElement("h1")

  input.appendChild(h1)

  var output = doc.createElement("div")

  doc.body.appendChild(input)
  doc.body.appendChild(output)

  var rs = innerhtml.createReadStream(input, {objectMode: true, remove: true})
  var ws = innerhtml.createWriteStream(output, {objectMode: true})

  t.equal(output.childNodes.length, 0, "Output div should have zero children")

  ws.on("finish", function () {
    var nodes = output.childNodes
    t.equal(nodes.length, 1, "Output div should have just one child")
    t.equal(nodes[0].tagName, "H1", "A h1 element should have been added to the output div")
    t.equal(nodes[0], h1, "h1 element in output div should be same as h1 element from the input div")

    nodes = input.childNodes
    t.equal(nodes.length, 0, "Input div should be empty")

    // Clean up
    doc.body.removeChild(input)
    doc.body.removeChild(output)

    t.end()
  })

  rs.pipe(ws)
})

// We shouldn't be able to pipe to two destinations in objectMode as the emitted nodes will be appended to one
// destination node and then the other. Hence there is no corresponding test for this.
test("pipe to two destinations", function (t) {
  var input = doc.createElement("div")
  var h1 = doc.createElement("h1")
  var p = doc.createElement("p")
  var div = doc.createElement("div")

  input.appendChild(h1)
  input.appendChild(p)
  input.appendChild(div)

  var output0 = doc.createElement("div")
  var output1 = doc.createElement("div")

  doc.body.appendChild(input)
  doc.body.appendChild(output0)
  doc.body.appendChild(output1)

  var rs = innerhtml.createReadStream(input)
  var ws0 = innerhtml.createWriteStream(output0)
  var ws1 = innerhtml.createWriteStream(output1)

  t.equal(output0.childNodes.length, 0, "Output0 div should have zero children")
  t.equal(output1.childNodes.length, 0, "Output1 div should have zero children")

  ws0.on("finish", function () {
    var nodes = output0.childNodes
    t.equal(nodes.length, 3, "Output0 div should have three children")
    t.equal(nodes[0].tagName, "H1", "A h1 element should have been added to the output0 div")
    t.equal(nodes[1].tagName, "P", "A p element should have been added to the output0 div")
    t.equal(nodes[2].tagName, "DIV", "A div element should have been added to the output0 div")

    doc.body.removeChild(output0)

    if (ws0._writableState.finished && ws1._writableState.finished) {
      doc.body.removeChild(input)
      t.end()
    }
  })

  ws1.on("finish", function () {
    var nodes = output1.childNodes
    t.equal(nodes.length, 3, "Output1 div should have three children")
    t.equal(nodes[0].tagName, "H1", "A h1 element should have been added to the output1 div")
    t.equal(nodes[1].tagName, "P", "A p element should have been added to the output1 div")
    t.equal(nodes[2].tagName, "DIV", "A div element should have been added to the output1 div")

    doc.body.removeChild(output1)

    if (ws0._writableState.finished && ws1._writableState.finished) {
      doc.body.removeChild(input)
      t.end()
    }
  })

  rs.pipe(ws0)
  rs.pipe(ws1)
})

test("pipe to two destinations clone on write", function (t) {
  var input = doc.createElement("div")
  var h1 = doc.createElement("h1")
  var p = doc.createElement("p")
  var div = doc.createElement("div")

  input.appendChild(h1)
  input.appendChild(p)
  input.appendChild(div)

  var output0 = doc.createElement("div")
  var output1 = doc.createElement("div")

  doc.body.appendChild(input)
  doc.body.appendChild(output0)
  doc.body.appendChild(output1)

  var rs = innerhtml.createReadStream(input, {objectMode: true, remove: true})
  var ws0 = innerhtml.createWriteStream(output0, {objectMode: true})
  var ws1 = innerhtml.createWriteStream(output1, {objectMode: true, clone: true})

  t.equal(output0.childNodes.length, 0, "Output0 div should have zero children")
  t.equal(output1.childNodes.length, 0, "Output1 div should have zero children")

  ws0.on("finish", function () {
    var nodes = output0.childNodes
    t.equal(nodes.length, 3, "Output0 div should have three children")
    t.equal(nodes[0], h1, "h1 element should be the same element that was in input div")
    t.equal(nodes[1], p, "p element should be the same element that was in input div")
    t.equal(nodes[2], div, "div element should be the same element that was in input div")

    doc.body.removeChild(output0)

    if (ws0._writableState.finished && ws1._writableState.finished) {
      doc.body.removeChild(input)
      t.end()
    }
  })

  ws1.on("finish", function () {
    var nodes = output1.childNodes
    t.equal(nodes.length, 3, "Output1 div should have three children")
    t.equal(nodes[0].tagName, "H1", "A h1 element should have been added to the output1 div")
    t.equal(nodes[1].tagName, "P", "A p element should have been added to the output1 div")
    t.equal(nodes[2].tagName, "DIV", "A div element should have been added to the output1 div")

    doc.body.removeChild(output1)

    if (ws0._writableState.finished && ws1._writableState.finished) {
      doc.body.removeChild(input)
      t.end()
    }
  })

  rs.pipe(ws0)
  rs.pipe(ws1)
})