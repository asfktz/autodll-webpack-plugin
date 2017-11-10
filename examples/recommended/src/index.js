const moment = require('moment');
const React = require('react');
const ReactDOM = require('react-dom');
const createElement = React.createElement;

const Test = createElement('div', {}, [
  createElement('h1', {}, ['AutoDllPlugin Recommended Setup']),
  createElement('p', {}, [moment().format('LLLL')]),
]);

ReactDOM.render(Test, document.getElementById('root'));
