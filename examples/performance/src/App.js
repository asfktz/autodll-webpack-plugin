import axios from 'axios';
import Draft from 'draft-js';
import howler from 'howler';
import Immutable from 'immutable';
import Pixi from 'pixi.js';
import polished from 'polished';
import React from 'react';
import reactA11y from 'react-a11y';
import reactBootstrap from 'react-bootstrap';
import ReactDOM from 'react-dom';
import reactHelmet from 'react-helmet';
import reactMotion from 'react-motion';
import reactPlayer from 'react-player';
import reactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';
import redux from 'redux';
import styled from 'styled-components';

export default () => {
  return (
    <div>
      <h1>AutoDllPlugin Performance Test</h1>
      <p>
        1. Open ./src/App.js and change this Text to see how long it takes for webpack to build when
        AutoDllPlugin is active.
      </p>
      <p>2. Then go to ./webpack.config.js, remove the Plugin, and try again.</p>
      <p>Note: Look for the word "Time:" in your terminal output, to see long each build took.</p>
    </div>
  );
};
