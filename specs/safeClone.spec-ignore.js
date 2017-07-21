function Bob(name) {
  this.name = name;
}

class Test {
  constructor(name) {
    this.name = name;
  }
}

let config = {
  funcs: {
    love: function(love) {
      return true;
    }
  },
  plugins: [new Bob('alex'), new Test('koko')]
};



let cloned = _.cloneDeepWith(config, value => {
  if (_.isObject(value) && (!_.isPlainObject(value) && !_.isArray(value))) {
    console.log(value);
    return value;
  }
});

console.log(cloned);
console.log(
  'should not clone function',
  cloned.funcs.love === config.funcs.love
);
console.log(
  'should not clone function instance',
  cloned.plugins[0] === config.plugins[0]
);
console.log(
  'should not clone class instance',
  cloned.plugins[1] === config.plugins[1]
);

console.log('should clone array', cloned.plugins !== config.plugins);
console.log('should clone object', cloned.funcs !== config.funcs);
