import * as React from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { View, Text, ListItem, } from "react-native-ui-lib";
import { useUserTemplateList, useTemplateFixedPoint } from '../hooks/useData'
import { Colors } from "../config";

const renderItem = ({ item, onClick }) => {
  return <ListItem key={item.id} style={styles.listItem} onPress={onClick}>
    {item.isWarn === '0' && <View style={styles.dot} />}
    <View center flex><Text>{item.fixedPointNameAndBugName}</Text></View>
  </ListItem>
}


export const Sidebar = ({ open: propsOpen, children, onOpenChange }) => {
  const navigation = useNavigation()
  const ref = React.useRef(null)
  const openRef = React.useRef(propsOpen)
  const { data: userTemplateList } = useUserTemplateList()
  const { data: templateFixedPointList, error, loading, refresh } = useTemplateFixedPoint();

  // console.log(templateFixedPointList, error, 'error')

  React.useEffect(() => {
    // console.log(propsOpen)
    if (ref.current && openRef.current !== null && openRef.current !== propsOpen) {
      openRef.current = propsOpen
      ref.current[propsOpen ? 'openDrawer' : 'closeDrawer']()
    }

  }, [propsOpen, ref, openRef])

  const mekeTemplateFixedPointList = React.useCallback((data) => {
    if (!data) {
      return []
    }
    return data.map(item => {
      const id = item.deviceId + '-' + item.templateId
      if ((userTemplateList || []).find(u => u.id === id)) {
        return {
          ...item,
          id,
          isWarn: '2'
        }
      }
      return { ...item, id }
    })
  }, [userTemplateList])


  const handleClick = index => {
    const { deviceId, templateId } = templateFixedPointList[index]
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
      <FlatList
        ListEmptyComponent={<View height={400} center><Text text70>暂无数据</Text></View>}
        refreshing={loading}
        onRefresh={refresh}
        data={mekeTemplateFixedPointList(templateFixedPointList)}
        renderItem={({ item, index }) => renderItem({
          item, onClick() {
            handleClick(index)
          }
        })}
        keyExtractor={item => item.id}
      />
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
    paddingHorizontal: 8,
  },
  dot: {
    width: 8,
    height: 8,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: '#f00'
  }
});
