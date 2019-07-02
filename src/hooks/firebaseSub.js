import { useState } from 'react';

import { store } from '../config/firebase';

export function useSubDoc(path) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState([]);

  useEffect(() => {
    const unsubscribe = store.doc(path).onSnapshot(snapShot => {
      console.log(snapShot);
      // setDoc({ id: snapShot.id, ...snapShot.data() });
    });
    return () => unsubscribe();
  }, [path]);

  return {
    error,
    loading,
    doc,
  };
}
