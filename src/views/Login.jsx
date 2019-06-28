import React, { useContext, useEffect } from 'react';

import { authHandler, authContext } from '../hooks/Auth';

import { Redirect } from 'react-router-dom';
import { Button, Typography } from 'antd';

export default function Login(props) {
  return (
    <authContext.Consumer>
      {user => {
        if (user) {
          return <Redirect to="/" />;
        } else {
          return (
            <div
              style={{
                minHeight: '100vh',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div>
                <Typography.Title style={{ fontWeight: 'bold' }}>
                  Tinier
                  <span style={{ color: '#2196F3' }}>Url</span>
                </Typography.Title>
                <Typography.Title level={4}>
                  Sign In & Start Sharing
                </Typography.Title>
                <Button
                  type="primary"
                  shape="round"
                  type="danger"
                  icon="google"
                  loading={false}
                  size="large"
                  onClick={() => authHandler('google')}
                  style={{ margin: 10 }}
                >
                  Google
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  icon="user"
                  loading={false}
                  size="large"
                  onClick={() => authHandler('guest')}
                  style={{ margin: 10 }}
                >
                  Guest
                </Button>
              </div>
            </div>
          );
        }
      }}
      {/* <div>
        <button onClick={() => authHandler('google')}>Google</button>
        <button onClick={() => authHandler('guest')}>Guest</button>
      </div> */}
    </authContext.Consumer>
  );
}
