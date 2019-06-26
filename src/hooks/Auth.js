import { useContext, createContext, useState, useEffect } from 'react';

import firebase from '../config/firebase';

export const authContext = createContext({
  user: null,
});

export const useSession = () => {
  const { user } = useContext(authContext);
  return user;
};

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = firebase.auth().currentUser;
    return {
      initializing: !user,
      user,
    };
  });

  function onChange(user) {
    setState({ initializing: false, user });
  }

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChange(onChange);

    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};

export const authHandler = type => {
  switch (type) {
    case 'google':
      console.log('googleAuth');
      return null;
    default:
      console.log('guestUser');
  }
};
