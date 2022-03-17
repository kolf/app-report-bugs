import React, { useState, useContext, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
// import { onAuthStateChanged } from 'firebase/auth';

import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { AuthenticatedUserContext } from '../providers';
import { Loading } from '../components';
// import { auth } from '../config';

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState();

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    // const unsubscribeAuthStateChanged = onAuthStateChanged(
    //   auth,
    //   authenticatedUser => {
    //     authenticatedUser ? setUser(authenticatedUser) : setUser(null);
    //     setIsLoading(false);
    //   }
    // );

    // // unsubscribe auth listener on unmount
    // return unsubscribeAuthStateChanged;
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
