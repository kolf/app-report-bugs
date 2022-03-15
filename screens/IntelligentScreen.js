import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { useMarkerList } from "../hooks/useData";

export const HomeScreen = () => {


  return (
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
