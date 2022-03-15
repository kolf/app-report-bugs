import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { View, Text, ListItem, } from "react-native-ui-lib";
import { Colors } from "../config";

const renderItem = ({ item, onClick }) => {
  return <ListItem key={item.id} style={styles.listItem} onPress={onClick}>
    <Text>
      {item.fixedPointNameAndBugName}
    </Text>
  </ListItem>
}


export const Sidebar = ({ dataSource, show, onClose, children }) => {
  const navigation = useNavigation()
  const handleDrawerSlide = (e) => {

  }

  const handleClick = index => {
    const { deviceId, templateId } = dataSource[index]
    navigation.navigate('CreateStep1', {
      deviceId,
      templateId
    })
  }


  const renderDrawer = () => {
    return (
      <View style={styles.root}>
        <FlatList
          data={dataSource}

          renderItem={({ item, index }) => renderItem({
            item, onClick() {
              handleClick(index)
            }
          })}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };

  return (
    <DrawerLayout
      drawerWidth={260}
      drawerPosition={DrawerLayout.positions.Right}
      drawerType="front"
      drawerBackgroundColor="#fff"
      renderNavigationView={renderDrawer}
      onDrawerSlide={handleDrawerSlide}
    >
      {children}
    </DrawerLayout>
  );
};

const styles = StyleSheet.create({
  root: {

  }, listItem: {
    // padding: 8,
    height: 50,
    alignItems: 'center',
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1,
    paddingHorizontal: 8

    // backgroundColor: '#f00'
  }
});
