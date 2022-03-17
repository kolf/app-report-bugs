import * as React from 'react';
import { StyleSheet, StatusBar, Text, Pressable } from "react-native";
import { View } from 'react-native-ui-lib'
import { Sidebar, Icon } from '../components'
import { useMarkerList, useTemplateFixedPoint, useAllTemplateData, useMarkerTemplate, useUserTemplateList } from '../hooks/useData'

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
