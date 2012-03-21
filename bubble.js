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

  return function wrapper(cb) {

    renewed = true

    if (cb && (typeof cb != 'function')) { throw new Error('Please provide a callback to bubble')}

    return function actualHandler(err) {
      var argValuesIndex = 1
      if (err) {
        if (err instanceof Error) { return done(err) }
        argValuesIndex = 0
      }

      if (! isDone) {
        renewed = false
        var args = Array.prototype.slice.call(arguments, argValuesIndex);
        if (cb) {
          try {
            cb.apply({}, args)
          } catch(err) {
            return done(err)
          }
        } else {
          if (args[0] && ! (args[0] instanceof Error)) { args.unshift(undefined) } // insert first empty argument
          return done.apply({}, args)
        }
        if (! renewed) {
          if (args[0] && ! (args[0] instanceof Error)) { args.unshift(undefined) } // insert first empty argument
          return done.apply({}, args)
        }
      }
    }
  }
}

module.exports = bubble;