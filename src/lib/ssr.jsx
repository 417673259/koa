import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';
import { Route, Switch, matchPath } from 'react-router-dom';
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { getRouters, getReducer } from '../webpack/getSsrFile';

export async function getComponent(ctx, next) {
  const { request } = ctx;
  const routers = getRouters();
  const { length } = routers;
  for (let i = 0; i < length; i += 1) {
    const match = matchPath(request.path, routers[i]);
    if (match) {
      ctx.request.Component = routers[i].component;
      ctx.request.PARAMS = match.params;
      break;
    }
  }
  return next();
}

export async function fetchData(ctx, next) {
  const { request: { query, Component, PARAMS = {} } } = ctx;
  const store = createStore(getReducer(), undefined, applyMiddleware(thunk));
  if (Component && Component.fetchInitialProps) {
    try {
      await Component.fetchInitialProps({
        params: PARAMS,
        query,
        dispatch: store.dispatch,
      });

      const routers = getRouters();
      const html = renderToString(
        <Provider store={store}>
          <StaticRouter
            location={ctx.request.path}
            context={{}}
          >
            <Switch>
              {
              routers.map(router => (
                <Route
                  path={router.path}
                  component={Component}
                  key={router.path}
                />
              ))
            }
            </Switch>
          </StaticRouter>
        </Provider>,
      );

      ctx.state.HTML = html;
      ctx.state.TITLE = '古诗词全集，古诗词大全，古代诗人大全';
      ctx.state.DATA = JSON.stringify(store.getState()).replace(/\\n/g, '');
    } catch (err) {
      console.log(err);
      console.log(22222222222);
    }
  }
  return next();
}
