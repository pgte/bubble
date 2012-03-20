var test = require('tap').test
  , bubble = require('./')
  , fs = require('fs')

var DEFAULT_TIMEOUT = 10000

test('figures out completion', function(t) {

  var b = bubble(DEFAULT_TIMEOUT, function(err) {
    t.ok(true, 'must reach here')
    t.end();
  })

  fs.readFile('./fixtures/exists', 'utf8', b(function(body) {
    t.ok(true, 'must reached here')
    t.equal('ABC', body, 'body must match')
  }))
})

test('calls back on error and does not continue', function(t) {
  
  var b = bubble(DEFAULT_TIMEOUT, function(err) {
    t.ok(true)
    t.end()
  })

  fs.readFile('./does_not_exist', b(function(body) {
    t.ok(false, 'should have not reached here')
  }))
})

test('timesout', function(t) {

  var b = bubble(10, function(err) {
    t.ok(!! err, 'error must exist')
    t.equal('Timeout reached', err.message)
    t.end()
  })

  setTimeout(b(function() {
    t.ok(false, 'must not reach here')
  }), 100)

})

test('works without timeout', function(t) {

  var b = bubble(function(err) {
    t.ok(true, 'must reach here')
    t.end()
  })

  fs.readFile('./fixtures/exists', 'utf8', b(function(body) {
    t.ok(true, 'must reached here')
    t.equal('ABC', body, 'body must match')
  }))

})

test('catches thrown errors', function(t) {
  var b = bubble(10, function(err) {
    t.ok(!! err, 'error must exist')
    t.equal('heyheyhey', err.message)
    t.end()
  })

  fs.readFile('./fixtures/exists', 'utf8', b(function(body) {
    throw new Error('heyheyhey');
  }))
})

test('can use it to return callback values', function(t) {
  var b = bubble(10, function(err, fileData) {
    t.ok(! err, 'error must not exist')
    t.equal('ABC', fileData)
    t.end()
  })

  fs.readFile('./fixtures/exists', 'utf8', b());

})

test('allows nested callbacks', function(t) {
  var b = bubble(10, function(err, fileData) {
    t.ok(! err, 'error must not exist')
    t.equal('DEF', fileData)
    t.end()
  })

  fs.readFile('./fixtures/exists', 'utf8', b(function(body) {
    fs.readFile('./fixtures/exists2', 'utf8', b())
  }))
})
