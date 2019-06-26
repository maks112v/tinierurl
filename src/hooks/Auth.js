import { useContext, createContext, useState, useEffect } from 'react';

import firebase, { store } from '../config/firebase';

var googleProvider = new firebase.auth.GoogleAuthProvider();

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
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};

export const authHandler = type => {
  const userCheck = ({ additionalUserInfo, user }) => {
    console.log(user);
    if (additionalUserInfo.isNewUser) {
    }
  };

  const guestUser = ({ additionalUserInfo, user }) => {
    console.log(user);
    if (additionalUserInfo.isNewUser) {
      store
        .collection('guests')
        .doc(user.uid)
        .set({ createdAt: user.metadata.creationTime })
        .then(res => console.log(res));
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
