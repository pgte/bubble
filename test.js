var test = require('tap').test
  , bubble = require('./')
  , fs = require('fs')
  ;

var DEFAULT_TIMEOUT = 10000


test('figures out completion', function(t) {

  var b = bubble(DEFAULT_TIMEOUT, function(err) {
    t.ok(! err, 'no error')
    t.ok(true, 'must reach here')
    t.end();
  })

  fs.readFile('./fixtures/exists', 'utf8', b(function(body) {
    t.ok(true, 'must reached here')
    t.equal(body, 'ABC', 'body must match')
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
    t.equal(err.message, 'Timeout reached')
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
    t.equal(body, 'ABC', 'body must match')
  }))

})

test('catches thrown errors', function(t) {
  var b = bubble(10, function(err) {
    t.ok(!! err, 'error must exist')
    t.equal(err.message, 'heyheyhey')
    t.end()
  })

  fs.readFile('./fixtures/exists', 'utf8', b(function(body) {
    throw new Error('heyheyhey');
  }))
})

test('can use it to return callback values', function(t) {
  var b = bubble(10, function(err, fileData) {
    t.ok(! err, 'error must not exist')
    t.equal(fileData, 'ABC')
    t.end()
  })

  fs.readFile('./fixtures/exists', 'utf8', b());

})

test('allows nested callbacks', function(t) {
  var b = bubble(10, function(err, fileData) {
    t.ok(! err, 'error must not exist')
    t.equal(fileData, 'DEF')
    t.end()
  })

  fs.readFile('./fixtures/exists', 'utf8', b(function(body) {
    fs.readFile('./fixtures/exists2', 'utf8', b())
  }))
})

test('does not throw error if first callback argument is not error', function(t) {
  var b = bubble(function(err, value) {
    t.ok(! err, 'error must not exist')
    t.equal(value, 'HEYHEY')
    t.end()
  })

  setTimeout(b(), 10, 'HEYHEY')
})
