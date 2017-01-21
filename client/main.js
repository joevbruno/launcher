/* @flow */
import 'normalize.css/normalize.css';
import '../common/styles/global.scss';

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { fromJS } from 'immutable';
import configureStore from '../common/redux/store/configureStore';
import { App } from '../common/main';
import theme from '../common/styles/theme';

const rootElement = document.querySelector('#app');
const initialState = window.__APP_STATE__; // eslint-disable-line no-underscore-dangle

Object.keys(initialState).forEach(key => (initialState[key] = fromJS(initialState[key])));
const store = configureStore(initialState);
window.peakState = () => store.getState();

function renderApp(AppRoot) {
  render(
    <AppContainer>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AppRoot />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </AppContainer>,
    rootElement,
  );
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(
    '../common/main.js',
    () => renderApp(require('../common/main.js').App),
  );
}

renderApp(App);
