import React, { useState, useEffect } from 'react';

import { store } from '../config/firebase';

export default function ToLInk({ match: { isExact, params }, ...rest }) {
  const [state, setState] = useState({ redirectUrl: '', isLoading: true });
  const domain = window.location.host;

  useEffect(() => {
    const unsubscribe = store
      .collection('domains')
      .limit(1)
      .where('hostname', '==', domain)
      .onSnapshot(snapShot => {
        snapShot.forEach(doc => {
          const path = doc.ref.path;
          store
            .doc(path)
            .collection('redirects')
            .doc(params.id)
            .onSnapshot(snapShot => {
              if (snapShot.exists) {
                const { url } = snapShot.data();
                setState({ isLoading: false, redirectUrl: url });
                // window.location.replace(url);
              } else {
                setState({
                  isLoading: false,
                  error: true,
                  message: 'Invalid Link',
                });
              }
            });
          console.log(path);
        });
      });

    return () => unsubscribe();
  }, []);

  if (!isExact) {
    return (
      <div>
        <h1>Please Check Link</h1>
      </div>
    );
  }
  if (state.isLoading) {
    return (
      <div>
        <h3>Getting Redirect</h3>
      </div>
    );
  }
  return (
    <div>
      <h3>Redirect : {state.error ? state.message : state.redirectUrl} </h3>
    </div>
  );
}
