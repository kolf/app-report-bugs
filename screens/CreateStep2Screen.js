import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { useMarkerList } from "../hooks/useData";

export const CreateStep2Screen = () => {
  const { data: markerList } = useMarkerList();

  console.log(markerList, 'list')

  const handleLogout = () => {
    // signOut(auth).catch(error => console.log('Error logging out: ', error));
  };
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
