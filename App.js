import React from 'react';
// import { StatusBar } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { Colors, Typography, Spacings, Assets } from 'react-native-ui-lib';
import { AuthenticatedUserProvider } from './providers';
import { Colors as colors, Typography as typography, Images as images, Icons as icons } from './config'

Colors.loadColors(colors);
Assets.loadAssetsGroup('images', images)
Assets.loadAssetsGroup('icons', icons)
Typography.loadTypographies(typography);

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
        <StatusBar style='dark' />
        <RootNavigator />
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
