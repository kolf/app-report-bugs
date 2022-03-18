import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib'
import { Colors } from '../config';

export const Loading = (props) => {
  return (
    <View style={styles.root} center {...props}>
      <ActivityIndicator size='large' color={Colors.success} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {

  }
});
