import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import { authContext, useAuth, authHandler } from './hooks/Auth';

import Dashboard from './views/Dashboard';
import Login from './views/Login';
import ToLink from './views/ToLink';

function App() {
  const { user, initializing } = useAuth();
  if (initializing) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }
  return (
    <authContext.Provider value={user}>
      <button onClick={authHandler}>Logout</button>
      <Switch>
        <Route exact path="/login" render={props => <Login {...props} />} />
        <PrivateRoute exact path="/" component={Dashboard} />
        <Route path="/:id" render={props => <ToLink {...props} />} />
      </Switch>
    </authContext.Provider>
  );
}

export default App;