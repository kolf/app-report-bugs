import * as React from 'react';
import { StyleSheet, StatusBar, Text, Pressable } from "react-native";
// import { MapView, MapType, AMapSdk } from "react-native-amap3d";
import { View, LoaderScreen } from 'react-native-ui-lib'
import { Sidebar, Icon, Loading } from '../components'
import { Colors } from '../config'
import { useMarkerList, useTemplateFixedPoint, useAllTemplateData, useMarkerTemplate, useUserTemplateList } from '../hooks/useData'

// AMapSdk.init(
//   Platform.select({
//     android: "c52c7169e6df23490e3114330098aaac",
//     ios: "186d3464209b74effa4d8391f441f14d",
//   })
// );

const FloatButton = ({ icon, style, onClick }) => {
  return <Pressable onPress={onClick} style={style}><View borderRadius={4} backgroundColor='#fff' width={40} height={40} center><Icon name={icon} size={24} /></View></Pressable>
}

export const MapScreen = () => {
  const [showMenu, setShowMenu] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { data: markerList } = useMarkerList()
  const { data: userTemplateList } = useUserTemplateList()
  const { run: getMarkerTemplate } = useMarkerTemplate()
  const { data: templateFixedPointList, refresh, isValidating } = useTemplateFixedPoint()
  const { run } = useAllTemplateData()
  // const { data: markerList } = useMarkerList();

  console.log(loading, 'downloadLoading')

  React.useEffect(() => {

  }, [])

  const downloadTemplate = async () => {
    setLoading(true)
    try {
      const res = await run(templateFixedPointList)
      console.log(res, templateFixedPointList, 'res')
    } catch (error) {
      console.error(error, 'error')
    }
    setLoading(false)

  }

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

  // console.log(allTemplateDataLoading, 'allTemplateDataLoading')


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

  if (loading) {
    return <Loading></Loading>
  }

  return (
    <View style={styles.root}>
      <Sidebar onRefresh={refresh} refreshing={isValidating} open={showMenu} dataSource={mekeTemplateFixedPointList(templateFixedPointList)} onOpenChange={setShowMenu}>
        <View absR style={styles.btnGroup}><FloatButton icon='menu' onClick={() => setShowMenu(true)} />
          <FloatButton style={{ marginTop: 8 }} icon='download' onClick={() => downloadTemplate()} /></View>
        {/* {loading && <LoaderScreen color={Colors.primary} message="下载数据中..." overlay />} */}
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
