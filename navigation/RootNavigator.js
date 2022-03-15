import React, { useState, useContext, useEffect } from 'react';
import { Image, StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
// import { onAuthStateChanged } from 'firebase/auth';

import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { AuthenticatedUserContext } from '../providers';
import { LoadingIndicator } from '../components';
// import { auth } from '../config';

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(false);

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

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};