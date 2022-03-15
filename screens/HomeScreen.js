import * as React from 'react';
import { View, StyleSheet, StatusBar, Text, NavigationContainer } from "react-native";
import { Sidebar } from '../components'
import { useMarkerList, useTemplateFixedPoint, useAllTemplateData, useMarkerTemplate, useUserTemplateList } from '../hooks/useData'


export const HomeScreen = () => {
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
    <View style={styles.container}>
      <Sidebar show={showMenu} dataSource={mekeTemplateFixedPointList(templateFixedPointList)} onClose={() => setShowMenu(false)} >

      </Sidebar>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
