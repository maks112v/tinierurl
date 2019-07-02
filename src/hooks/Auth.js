import { useContext, createContext, useState, useEffect } from 'react';

import firebase, { store } from '../config/firebase';

var googleProvider = new firebase.auth.GoogleAuthProvider();

export const authContext = createContext({
  user: null,
});

export const useSession = () => {
  const session = useContext(authContext);
  return session;
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
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);

    return () => unsubscribe();
  }, []);

  return state;
};

export const authHandler = type => {
  const userCheck = ({ user }) => {
    store
      .collection('users')
      .doc(user.uid)
      .set({
        createdAt: user.metadata.creationTime,
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.displayName,
        photoURL: user.photoURL,
      });
  };

  const guestUser = ({ additionalUserInfo, user }) => {
    if (additionalUserInfo.isNewUser) {
      store
        .collection('guests')
        .doc(user.uid)
        .set({ createdAt: user.metadata.creationTime });
    }
  };

  switch (type) {
    case 'google':
      return firebase
        .auth()
        .signInWithPopup(googleProvider)
        .then(userCheck);
    case 'guest':
      return firebase
        .auth()
        .signInAnonymously()
        .then(guestUser);
    default:
      return firebase.auth().signOut();
  }
};
