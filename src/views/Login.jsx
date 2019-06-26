import React from 'react';

import { authHandler, authContext } from '../hooks/Auth';

import { Redirect } from 'react-router-dom';

export default function Login(props) {
  return (
    <authContext.Consumer>
      {user => {
        if (user) {
          return <Redirect to="/" />;
        } else {
          return (
            <div>
              <button onClick={() => authHandler('google')}>Google</button>
              <button onClick={() => authHandler('guest')}>Guest</button>
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
