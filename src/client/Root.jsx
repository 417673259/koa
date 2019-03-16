import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import routers from './routers';


export default class Root extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <Router>
        <Switch>
          {
            routers.map(router => (
              <Route
                path={router.path}
                component={router.component}
                key={router.path}
                exact={router.exact}
              />
            ))
          }
        </Switch>

      </Router>
    );
  }
}
