import * as React from "react";
import { StyleSheet, ScrollView, } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Incubator } from 'react-native-ui-lib'
import { FormItem, FormList, TableForm, ImagePicker, View as RNView } from "../components";
import { useDetails, usePosition } from "../hooks/useData";

export const DetailsScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const { params } = route
  const { data: templateDetailsData, error } = useDetails(params.id)
  const { data: positionData } = usePosition(params.deviceId)

  const loading = !positionData || !templateDetailsData

  const columns = React.useMemo(() => {
    if (!templateDetailsData) {
      return []
    }
    const { templateCellDataVOMatrix = [[]] } = templateDetailsData;
    return [{
      key: -1,
      dataIndex: 'index',
      title: '序号'
    }, ...templateCellDataVOMatrix[0].reduce((result, item) => {
      if (!result.find(r => item.templateCellId === r.key)) {
        result.push({
          key: item.templateCellId,
          dataIndex: 'cell-' + item.templateCellId,
          title: item.templateCellName
        })
      }
      return result
    }, [])]
  }, [templateDetailsData])


  const memoData = React.useMemo(() => {
    if (!templateDetailsData) {
      return []
    }
    const { templateCellDataVOMatrix = [[]] } = templateDetailsData;

    return templateCellDataVOMatrix[0].map((item, index) => {
      return {
        index: index + 1,
        ['cell-' + item.templateCellId]: item.data
      }
    })
  }, [templateDetailsData])

  if (loading) {
    return null
  }

  // if (error) {
  //   return <Error />
  // }

  return (

    <ScrollView>
      <View paddingV-12 paddingH-16><Text text70>监测数据</Text></View>
      <FormList>
        <FormItem label='监测点位'>
          <Text>{positionData.name}</Text>
        </FormItem>
        <FormItem label='测报任务'>
          <Text>{templateDetailsData.bugName}</Text>
        </FormItem>

        <FormItem label='监测时间'>
          <Text>{templateDetailsData.recordTime}</Text>
        </FormItem>
        <FormItem label='温度'>
          <Text>{templateDetailsData.temperature}</Text>
        </FormItem>

        <FormItem label='树种'>
          <Text>{templateDetailsData.treeName}</Text>
        </FormItem>

        <FormItem label='物候'>
          <Text>{templateDetailsData.phenology}</Text>
        </FormItem>

        <FormItem label='天气'>
          <Text>{templateDetailsData.weather}</Text>
        </FormItem>
        <FormItem label='上报人'>
          <Text>{templateDetailsData.username}</Text>
        </FormItem>
      </FormList>
      <View paddingV-12 paddingH-16><Text text70>监测数据采集</Text></View>
      <TableForm columns={columns} dataSource={memoData} readOnly rowKey='index' />
      <View paddingV-12 paddingH-16><Text text70>上传图片</Text></View>
      <View backgroundColor='#fff' paddingV-12>
        <ImagePicker
          showAddBtn={false}
          files={[1, 2]?.map(item => ({ url: `https://raw.githubusercontent.com/wix/react-native-ui-lib/master/demo/src/assets/images/card-example.jpg` }))}
        />
      </View>
      <View paddingV-12 paddingH-16><Text text70>备注</Text></View>
      <View padding-24 backgroundColor='#fff'>
        <Incubator.TextField
          placeholder='请输入'
          disabled
          showCharCounter
          maxLength={200}
          fieldStyle={{
            height: 100,
            alignItems: 'flex-start'
          }}
        />
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
