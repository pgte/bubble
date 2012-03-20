function bubble(timeout, callback) {
  var isDone = false
    , renewed = false
    , timer;

  function done() {
    if (! isDone) {
      isDone = true;
      callback.apply({}, arguments)
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }
    }
  }

  if (typeof timeout == 'function') {
    callback = timeout
    timeout = undefined
  }

  if (! callback) { throw new Error('No callback provided') }
  if (timeout) {
    timer = setTimeout(function() {
      done(new Error('Timeout reached'))
    }, timeout)
  }

  function wrapper(cb) {

    renewed = true;

    if (cb && (typeof cb != 'function')) { throw new Error('Please provide a callback to bubble')}

    return function actualHandler(err) {
      if (err) { return done(err) }

      if (! isDone) {
        renewed = false
        var args = Array.prototype.slice.call(arguments, 1);
        if (cb) {
          try {
            cb.apply({}, args)
          } catch(err) {
            return done(err)
          }
        } else {
          return done.apply({}, arguments)
        }
        if (! renewed) {
          return done()
        }
      }
    }
  }

  return wrapper;
}

module.exports = bubble;