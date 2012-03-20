# Bubble

Aborts groups of callbacks.

Domains for the poor man.

With timeouts (if you will).

## Example:


```javascript
var bubble = require('bubble')
var timeout = 2000;

http.createServer(function(req, res) {

  var b = bubble(timeout, function(err, file_c_data) {
    if (err) {
      res.writeHead(500);
      res.write(err.message);
    } else {
      res.end(file_c_data);
    }
  });

  fs.readFile('./file_a', h(function(file_a_data) {
    fs.readFile('./file_b', h(function(file_b_data) {
      fs.readFile('./file_c', h());
    });
  }))
});
```