import React, { useState, useContext, useEffect } from 'react';
import { store } from '../config/firebase';

import { authContext } from '../hooks/Auth';

export default function AddLink() {
  let selectDomains = [];
  const user = useContext(authContext);

  const [isLoading, setIsLoading] = useState(true);
  const [longLink, setLongLink] = useState('');

  useEffect(() => {
    const unsubscribe = store
      .collection('domains')
      .where('access', '==', 'all')
      .onSnapshot(snapShot => {
        console.log(snapShot);
        snapShot.docs.map(doc => {
          selectDomains.push(doc.id);
        });
        setIsLoading(false);
      });

    return () => unsubscribe();
  });

  console.log(selectDomains);

  return (
    <form action="">
      <input
        type="text"
        placeholder="Long Link"
        value={longLink}
        onChange={e => setLongLink(e.target.value)}
        disabled={isLoading}
      />
      <select disabled={isLoading} />
    </form>
  );
}
