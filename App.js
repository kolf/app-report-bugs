import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { Colors, Typography, Spacings, Assets, Image } from 'react-native-ui-lib';
import { AuthenticatedUserProvider } from './providers';
import { Colors as colors, Typography as typography, Images as images, Icons as icons } from './config'

Colors.loadColors(colors);
Assets.loadAssetsGroup('images', images)
Assets.loadAssetsGroup('icons', icons)
Typography.loadTypographies(typography);


// Spacings.loadSpacings({
//   page: 20,
// });

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
