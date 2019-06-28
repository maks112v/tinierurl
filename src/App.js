import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import { authContext, useAuth, authHandler } from './hooks/Auth';
import { Layout, Menu, Spin, Typography } from 'antd';

import Dashboard from './views/Dashboard';
import Login from './views/Login';
import ToLink from './views/ToLink';

function App() {
  const { user, initializing } = useAuth();
  const [delay, setDelay] = useState(false);
  setTimeout(() => setDelay(false), 3000);
  if (initializing || delay) {
    return (
      <Layout style={{ backgroundColor: '#F9FBFD' }}>
        <Layout.Content
          style={{
            minHeight: '100vh',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
          }}
        >
          <div>
            <Spin size="large" />
            <Typography.Title style={{ fontWeight: 'bold' }}>
              Tinier
              <span style={{ color: '#2196F3' }}>Url</span>
            </Typography.Title>
            <Typography.Title level={4} style={{ color: '#757575' }}>
              Create and share trusted, powerful short links
            </Typography.Title>
          </div>
        </Layout.Content>
      </Layout>
    );
  }
  return (
    <authContext.Provider value={user}>
      {/* <button onClick={authHandler}>Logout</button> */}
      <Layout
        style={{
          backgroundColor: '#F9FBFD',
          minHeight: '100vh',
        }}
      >
        {/* {user && (
          <Layout.Header>
            <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
              <Menu.Item onClick={authHandler}>Logout</Menu.Item>
            </Menu>
          </Layout.Header>
        )} */}
        <Layout.Content>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Switch>
              <Route
                exact
                path="/login"
                render={props => <Login {...props} />}
              />
              <PrivateRoute exact path="/" component={Dashboard} />
              <Route path="/:id" render={props => <ToLink {...props} />} />
            </Switch>
          </div>
        </Layout.Content>
      </Layout>
    </authContext.Provider>
  );
}

export default App;
