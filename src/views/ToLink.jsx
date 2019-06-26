import React from 'react';

import { Redirect } from 'react-router-dom';

export default function ToLInk({ match: { isExact, params }, ...rest }) {
  const domain = window.location.host;
  console.log(isExact);
  if (!isExact) {
    return (
      <div>
        <h1>Please Check Link</h1>
      </div>
    );
  }
  return (
    <div>
      <h3>Redirect</h3>
    </div>
  );
}
