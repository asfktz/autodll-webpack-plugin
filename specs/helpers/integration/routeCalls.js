'use strict';

function routeCalls() {
  const callbacks = Array.from(arguments);
  let i = 0;

  return function() {
    const callback = callbacks[i] || callbacks[callbacks.length - 1];
    callback.apply(null, Array.from(arguments));
    i++;
  };
}

module.exports = routeCalls;
