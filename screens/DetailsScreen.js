import * as React from "react";
import { StyleSheet, ScrollView, } from "react-native";
import { View, Text } from 'react-native-ui-lib'
import { FormItem, FormList, TableForm, ImagePicker, View as RNView, Loading, Error } from "../components";
import { useDetails, usePosition } from "../hooks/useData";

export const DetailsScreen = ({ route }) => {
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
    }, ...templateCellDataVOMatrix.map(items => {
      const { templateCellId, templateCellName, } = items[0]
      return {
        key: templateCellId,
        dataIndex: 'cell-' + templateCellId,
        title: templateCellName
      }
    })]
  }, [templateDetailsData])


  const memoData = React.useMemo(() => {
    if (!templateDetailsData) {
      return []
    }
    const { templateCellDataVOMatrix = [] } = templateDetailsData;

    return templateCellDataVOMatrix.reduce((result, items, index) => {
      items.forEach((item, i) => {
        const id = 'index-' + i;
        if (!result.find(r => r.id === id)) {
          result[i] = {
            id,
            index: index + 1,
            ['cell-' + item.templateCellId]: item.data
          }
        } else {
          result[i] = {
            id,
            ...result[i],
            ['cell-' + item.templateCellId]: item.data
          }
        }
      })
      return result
      // const id = 'index-' + index
      // if (!result.find(r => r.id === id)) {
      //   result.push({
      //     index: index + 1,
      //     ['cell-' + item.templateCellId]: item.data
      //   })
      // }

      return result
    }, [])

    console.log(templateCellDataVOMatrix, templateCellDataVOMatrix.length, 'templateCellDataVOMatrix')

    return templateCellDataVOMatrix[0].map((item, index) => {
      return {
        index: index + 1,
        ['cell-' + item.templateCellId]: item.data
      }
    })
  }, [templateDetailsData])

  // console.log(error, loading, templateDetailsData?.imageList, 'loading')

  if (loading) {
    return <Loading flex />
  }

  console.log(templateDetailsData, 'templateDetailsData')

  if (error) {
    return <Error />
  }

  return (
    <ScrollView style={{ flex: 1 }}>
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
          <Text>{templateDetailsData.temperature || 0}℃</Text>
        </FormItem>

        <FormItem label='树种'>
          <Text>{templateDetailsData.treeName || '未知'}</Text>
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
          files={(templateDetailsData?.imageList || []).map(item => ({ url: item }))}
        />
      </View>
      <View paddingV-12 paddingH-16><Text text70>备注</Text></View>
      <View padding-24 backgroundColor='#fff' height={200}>
        <Text>{templateDetailsData.remark || '无'}</Text>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
