import React, { useState, createContext, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AuthenticatedUserContext = createContext({});


export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    console.log(user, 'user')
    if (user) {
      AsyncStorage.setItem('@user', JSON.stringify(user))
    } else {
      AsyncStorage.getItem('@user').then(res => {
        if (res) {
          setUser(JSON.parse(res))
        }
      })
    }
  }, [user])

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
