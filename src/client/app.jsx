import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reduce';
import Root from './Root';

const store = createStore(reducer, JSON.parse(window.CACHEDATA), applyMiddleware(thunk));

hydrate(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.querySelector('#root'),
);
