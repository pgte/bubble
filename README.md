# Bubble [![Build Status](https://secure.travis-ci.org/pgte/bubble.png)](http://travis-ci.org/pgte/bubble)

Domains for the poor man.

Flow-control for cascading callbacks.

Aborts groups of callbacks.

With timeouts (if you will).

Inspired by substack/node-toss.

## Example:


```javascript
var bubble = require('bubble')
var timeout = 2000

require('http').createServer(function(req, res) {

  var b = bubble(timeout, function(err, file_c_data) {
    if (err) {
      res.writeHead(500)
      res.write(err.message)
    } else {
      res.end(file_c_data)
    }
  });

  fs.readFile('./file_a', b(function(file_a_data) {
    fs.readFile('./file_b', b(function(file_b_data) {
      fs.readFile('./file_c', b())
    })
  }))
})
```

## You can also leave out the timeout:

```javascript
var b = bubble(function(err, file_c_data) {
  // ...
});

fs.readFile('./file_a', b(function(file_a_data) {
  // ...
});

```

## You can also leave out the last wrapper if you're not doing more IO and don't care about the callback values:

```javascript
var bubble = require('bubble')
var timeout = 2000

require('http').createServer(function(req, res) {

  var file_c_data;

  var b = bubble(timeout, function(err) {
    if (err) {
      res.writeHead(500)
      res.write(err.message)
    } else {
      res.end(file_c_data)
    }
  });

  fs.readFile('./file_a', b(function(file_a_data) {
    fs.readFile('./file_b', b(function(file_b_data) {
      fs.readFile('./file_c', function(err, value) {
        if (err) {
          // handle error
        }
        file_c_data = data;
        console.log('file ended, but bubble callback will be called anyway');
      })
    })
  }))
})
```
