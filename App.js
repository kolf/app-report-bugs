import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { Colors, Typography, Spacings } from 'react-native-ui-lib';
import { AuthenticatedUserProvider } from './providers';
import { Colors as colorsCfg, Typography as typographyCfg } from './config'

Colors.loadColors(colorsCfg);
Typography.loadTypographies(typographyCfg);


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
