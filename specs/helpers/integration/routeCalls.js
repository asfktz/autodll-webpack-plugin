const routeCalls = (...callbacks) => {
  let i = 0;

  return (...args) => {
    const callback = callbacks[i] || callbacks[callbacks.length - 1];
    callback(...args);
    i = i + 1;
  };
};

module.exports = routeCalls;
