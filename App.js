import React from "react";
import { SWRConfig } from "swr";
import { AppState } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./navigation/RootNavigator";
import { Colors, Typography, Assets } from "react-native-ui-lib";
import { AuthenticatedUserProvider } from "./providers";
import {
  Colors as colors,
  Typography as typography,
  Images as images,
  Icons as icons,
} from "./config";

Colors.loadColors(colors);
Assets.loadAssetsGroup("images", images);
Assets.loadAssetsGroup("icons", icons);
Typography.loadTypographies(typography);

const App = () => {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => {
          return true;
        },
        initFocus(callback) {
          let appState = AppState.currentState;
          const onAppStateChange = (nextAppState) => {
            if (
              appState.match(/inactive|background/) &&
              nextAppState === "active"
            ) {
              callback();
            }
            appState = nextAppState;
          };

          AppState.addEventListener("change", onAppStateChange);
        },
      }}
    >
      <AuthenticatedUserProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </SafeAreaProvider>
      </AuthenticatedUserProvider>
    </SWRConfig>
  );
};

export default App;
