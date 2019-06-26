import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import { authContext, useAuth } from './hooks/Auth';

import Dashboard from './views/Dashboard';
import Login from './views/Login';

function App() {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }
  return (
    <authContext.Provider value={{ user }}>
      <Switch>
        <Route exact path="/login" render={props => <Login {...props} />} />
        <PrivateRoute exact path="/" component={Dashboard} />
      </Switch>
    </authContext.Provider>
  );
}

export default App;
