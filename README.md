# Bubble

Aborts groups of callbacks.

Domains for the poor man.

With timeouts (if you will).

## Example:


```javascript
var bubble = require('bubble')
var timeout = 2000;

http.createServer(function(req, res) {

  var b = bubble(timeout, function(err, fileData) {
    if (err) {
      res.writeHead(500);
      res.write(err.message);
    } else {
      res.end(moreFileData);
    }
  });

  fs.readFile('./exists', h(function(fileData) {
    fs.readFile('./also_exists', h(function(moreFileData) {
      fs.readFile('./does_not_exist', h());
    });
  }))
});
```