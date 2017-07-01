import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function render (App) {
  ReactDOM.render(<App/>, document.getElementById('root'));
}

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const App = require('./App').default;
    render(App);
  });
}
