import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib'

export const Steps = ({ items, current }) => {
  return <View flexG row>
    {items.map((item, index) => <View flex center style={styles.item} key={'step-' + index}>
      <View style={{
        ...styles.circular,
        backgroundColor: Colors[current === index ? 'success' : 'border'],
      }} center><Text color={Colors[current === index ? 'white' : 'mediumGray']}>{index + 1}</Text></View>
      <View style={styles.title} paddingV-12><Text h4>{item.title}</Text></View>
      <View style={styles.line} absL={index > 0} absR={index === 0}><Text>1</Text></View>
    </View>)}
  </View>
};

const styles = StyleSheet.create({
  root: {

  },
  item: {

  },
  circular: {
    width: 30, height: 30, borderRadius: 20,
  },
  line: {
    height: 1,
    backgroundColor: Colors.border,
    width: '30%',
    top: 16
  }
});
