import * as React from "react";
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


export const Sidebar = ({ dataSource, open: propsOpen, children, onOpenChange }) => {
  const navigation = useNavigation()
  const ref = React.useRef(null)
  const openRef = React.useRef(propsOpen)

  React.useEffect(() => {
    // console.log(propsOpen)
    if (ref.current && openRef.current !== null && openRef.current !== propsOpen) {
      openRef.current = propsOpen
      ref.current[propsOpen ? 'openDrawer' : 'closeDrawer']()
    }

  }, [propsOpen, ref, openRef])


  const handleClick = index => {
    const { deviceId, templateId } = dataSource[index]
    navigation.navigate('CreateStep1', {
      deviceId,
      templateId
    })
  }

  const handleOpen = open => {
    openRef.current = open
    onOpenChange(open)
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
      ref={(el) => ref.current = el}
      drawerPosition={DrawerLayout.positions.Right}
      drawerType="front"
      drawerBackgroundColor="#fff"
      renderNavigationView={renderDrawer}
      onDrawerOpen={() => handleOpen(true)}
      onDrawerClose={() => handleOpen(false)}
    >
      {children}
    </DrawerLayout>
  );
};

const styles = StyleSheet.create({
  root: {

  },
  listItem: {
    height: 50,
    alignItems: 'center',
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1,
    paddingHorizontal: 8
  }
});
