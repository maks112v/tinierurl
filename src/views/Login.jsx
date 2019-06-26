import React from 'react';

import { authHandler } from '../hooks/Auth';

export default function Login(props) {
  console.log(props);
  return (
    <div>
      <button onClick={() => authHandler('google')}>Google</button>
      <button onClick={() => authHandler('guest')}>Guest</button>
    </div>
  );
}
