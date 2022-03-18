import * as React from 'react';
import { StyleSheet, StatusBar, Text, Pressable } from "react-native";
// import { MapView, MapType, AMapSdk } from "react-native-amap3d";
import { View } from 'react-native-ui-lib'
import { Sidebar, Icon } from '../components'
import { useMarkerList, useTemplateFixedPoint, useAllTemplateData, useMarkerTemplate, useUserTemplateList } from '../hooks/useData'

// AMapSdk.init(
//   Platform.select({
//     android: "c52c7169e6df23490e3114330098aaac",
//     ios: "186d3464209b74effa4d8391f441f14d",
//   })
// );

const FloatButton = ({ icon, onClick }) => {
  return <Pressable onPress={onClick}><View borderRadius={4} backgroundColor='#fff' width={40} height={40} center><Icon name={icon} size={24} /></View></Pressable>
}

export const MapScreen = () => {
  const [showMenu, setShowMenu] = React.useState(false)
  const { data: markerList } = useMarkerList()
  const { data: userTemplateList } = useUserTemplateList()
  const { run: getMarkerTemplate } = useMarkerTemplate()
  const { data: templateFixedPointList } = useTemplateFixedPoint()
  const { run, loading: allTemplateDataLoading } = useAllTemplateData()
  // const { data: markerList } = useMarkerList();

  // console.log(markerList, 'list')
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


  // return <MapView
  //   mapType={MapType.Satellite}
  //   initialCameraPosition={{
  //     target: {
  //       latitude: 39.91095,
  //       longitude: 116.37296,
  //     },
  //     zoom: 8,
  //   }}
  // />


  return (
    <View style={styles.root}>
      <Sidebar open={showMenu} dataSource={mekeTemplateFixedPointList(templateFixedPointList)} onOpenChange={setShowMenu}>
        <View absR style={styles.btnGroup}><FloatButton icon='menu' onClick={() => setShowMenu(true)} /></View>
      </Sidebar>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  btnGroup: {
    paddingTop: 30, paddingRight: 20
  }
});
