import * as React from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { View, Text, ListItem, Incubator, Button } from "react-native-ui-lib";
import { useUserTemplateList, useTemplateFixedPoint } from '../hooks/useData'
import { Colors } from "../config";

const renderItem = ({ item, onClick }) => {
  return <ListItem key={item.id} style={styles.listItem} onPress={onClick}>
    {item.isWarn === '0' && <View style={styles.dot} />}
    <View center flex><Text>{item.fixedPointNameAndBugName}</Text></View>
  </ListItem>
}

const SearchInput = ({ onSearch }) => {
  const [value, setValue] = React.useState('')
  return <Incubator.TextField
    onChangeText={setValue}
    value={value}
    validate={['required']}
    containerStyle={styles.input}
    fieldStyle={styles.fieldStyle}
    placeholder='请输入模板名称'
    trailingAccessory={<Button size='small' backgroundColor={Colors.success} borderRadius={0} label='搜索' onPress={() => onSearch(value)} />}
  />
}

export const Sidebar = ({ dataSource, open: propsOpen, refreshing, onRefresh, children, onOpenChange }) => {
  const navigation = useNavigation()
  const ref = React.useRef(null)
  const openRef = React.useRef(propsOpen)
  const [value, setValue] = React.useState('')


  const memoData = React.useMemo(() => {
    if (!value) {
      return dataSource
    }

    const re = new RegExp(value)
    return dataSource.filter(item => {
      return re.test(item.fixedPointNameAndBugName)
    })
  }, [dataSource, value])

  React.useEffect(() => {
    // console.log(propsOpen)
    if (ref.current && openRef.current !== null && openRef.current !== propsOpen) {
      openRef.current = propsOpen
      ref.current[propsOpen ? 'openDrawer' : 'closeDrawer']()
    }

  }, [propsOpen, ref, openRef])

  const handleClick = index => {
    const { deviceId, templateId } = memoData[index]
    navigation.navigate('CreateStep1', {
      deviceId,
      templateId
    })
  }

  const handleOpen = open => {
    openRef.current = open
    onOpenChange(open)
  }



  console.log(dataSource, memoData, 'data')

  return (
    <DrawerLayout
      drawerWidth={260}
      ref={(el) => ref.current = el}
      drawerPosition={DrawerLayout.positions.Right}
      drawerType="front"
      drawerBackgroundColor="#fff"
      renderNavigationView={() => <FlatList
        ListHeaderComponent={<SearchInput onSearch={setValue} />}
        ListEmptyComponent={<View height={400} center><Text text70>暂无数据</Text></View>}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={memoData}
        renderItem={({ item, index }) => renderItem({
          item, onClick() {
            handleClick(index)
          }
        })}
        keyExtractor={(item, i) => {
          return item.id + '-' + i
        }}
      />}
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
    borderTopColor: "#eeeeee",
    borderTopWidth: 1,
    marginTop: -1,
    marginLeft: 12
  },
  dot: {
    width: 8,
    height: 8,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: '#f00'
  },
  input: {
    padding: 12
  },
  fieldStyle: {
    backgroundColor: '#f5f5f5',
    height: 30,
    paddingLeft: 12
  }
});
