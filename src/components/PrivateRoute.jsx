import React from 'react';

import { Redirect, Route } from 'react-router-dom';
import { authContext } from '../hooks/Auth';

export default function PrivateRoute({ component: Component, ...rest }) {
  return (
    <authContext.Consumer>
      {value => {
        if (value) {
          return <Route {...rest} render={props => <Component {...props} />} />;
        }
        return <Redirect to="/login" />;
      }}
    </authContext.Consumer>
  );
}
