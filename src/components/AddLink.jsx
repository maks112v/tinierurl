import React, { useState, useContext, useEffect } from 'react';
import { store } from '../config/firebase';

import { authContext } from '../hooks/Auth';

export default function AddLink() {
  const user = useContext(authContext);

  const [isLoading, setIsLoading] = useState(true);
  const [longLink, setLongLink] = useState('');
  const [domain, setDomain] = useState('');
  const [selectDomains, setSelectDomains] = useState([]);

  function submitHandler(e) {
    e.preventDefault();
    store
      .collection('domains')
      .doc(domain)
      .collection('redirects')
      .add({
        url: longLink,
        owner: user.uid,
      })
      .then(res => {
        setLongLink('');
        setDomain('');
      });
  }

  useEffect(() => {
    const unsubscribe = store
      .collection('domains')
      .where('public', '==', true)
      .onSnapshot(snapShot => {
        let domains = [];
        snapShot.forEach(doc => {
          const id = doc.id;
          const { hostname } = doc.data();
          domains.push({ id, hostname });
        });
        setSelectDomains(domains);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        placeholder="Long Link"
        value={longLink}
        onChange={e => setLongLink(e.target.value)}
        disabled={isLoading}
      />
      <select
        disabled={isLoading}
        value={domain}
        onChange={e => setDomain(e.target.value)}
      >
        <option value="">Select a Domain</option>
        {selectDomains.map(({ id, hostname }) => (
          <option key={id} value={id}>
            {hostname}
          </option>
        ))}
      </select>
      <button type="submit">Create</button>
    </form>
  );
}
