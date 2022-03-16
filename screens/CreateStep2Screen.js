import * as React from "react";
import { StyleSheet, ScrollView, FlatList } from "react-native";
import { View, Text, Button, Incubator } from 'react-native-ui-lib'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View as RNView, Steps, FormList, FormItem, TableForm, ImagePicker } from '../components'
import { useTemplate, useUserTemplateList } from '../hooks/useData';
import { makeTableCellData } from '../lib/makeData'
import { Colors } from '../config'


const stepList = [{
  title: '天气物候'
}, {
  title: '监测数据采集'
}]

const getTableDataIndexMap = (columns) => {
  return columns.reduce((result, { dataIndex, title }) => {
    result[dataIndex] = title;
    return result
  }, {})
}

export const CreateStep2Screen = ({ route, navigation }) => {
  const { params } = route
  const _id = params.deviceId + '-' + params.templateId
  const { get: getUserTemplate, update: updateUserTemplate, remove: removeUserTemplate } = useUserTemplateList()
  const currentUserTemplate = getUserTemplate(_id)
  const { data: templateData } = useTemplate(params.templateId)

  const [formData, setFormData] = React.useState({
    remark: currentUserTemplate?.remark,
    fileList: currentUserTemplate?._fileList || [],
    tableData: currentUserTemplate?._tableData
  })

  const loading = !templateData;

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleNext = () => {
    const _tableDataIndexMap = getTableDataIndexMap(columns)
    try {
      removeUserTemplate({
        ...currentUserTemplate,
        _tableDataSize: memoData?.length,
        templateCellDataMap: makeTableCellData(_tableDataIndexMap, formData?.tableData, memoData?.length),   // [{index:1, cell-3:1, cell-1:3}]
        "monitorAvg": 5,
        "monitorSum": 15,
        "phenology": 1,
        remark: formData?.remark,
      })

      // Taro.showToast({ title: '上报成功～', icon: 'success' })
    } catch (error) {
      updateUserTemplate({
        id: _id,
        remark: formData?.remark,
        _fileList: formData?.fileList,
        _tableDataSize: data?.length,
        _tableData: formData?.tableData,
        _tableDataIndexMap
      })
      // Taro.showToast({ title: '上报失败～', icon: 'error' })
    }
    navigation.goBack(2)
  }

  const handlePrev = () => {
    updateUserTemplate({
      id: _id,
      remark: formData?.remark,
      _fileList: formData?.fileList,
      _tableData: formData?.tableData,
      _tableDataIndexMap: getTableDataIndexMap(columns)
    })
    navigation.goBack()
  }


  const memoData = React.useMemo(() => {
    if (!templateData) {
      return []
    }

    if (formData?.tableData) {
      return formData.tableData
    }
    const { dataRow = 0, templateCellList = [] } = templateData;
    let result = Array.from({ length: dataRow }, (item, index) => {
      let nextItem = { index: index + 1 }
      templateCellList.forEach(t => {
        nextItem['cell-' + t.id] = ''
      })
      return nextItem
    })
    return result
  }, [templateData, formData])

  const columns = React.useMemo(() => {
    if (!templateData) {
      return []
    }
    const { templateCellList = [] } = templateData;
    return [{
      dataIndex: 'index',
      title: '序号'
    }, ...templateCellList.map(t => ({
      dataIndex: 'cell-' + t.id,
      title: t.cellName
    }))]
  }, [templateData])
  // console.log(userTemplateData, 'templateData')
  if (loading) {
    return null
  }

  // console.log(treeRange, templateData.treeSeedList, 'list')

  return (
    <RNView isSafe>
      <ScrollView>
        <View paddingV-20><Steps
          items={stepList}
          current={1}
        /></View>
        <TableForm columns={columns} dataSource={memoData} rowKey='index' onChange={handleChange.bind(null, 'tableData')} />

        <View paddingV-12 paddingH-16 row><Text text70>上传图片</Text><Text marginT-4 color={Colors.error}>*</Text></View>
        <View backgroundColor='#fff' paddingV-12>
          <ImagePicker
            showAddBtn={true}
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

        <View paddingT-40 paddingH-16 paddingB-40>
          <View paddingV-8>
            <Button label='上一步' borderRadius={4} style={{ height: 48 }} backgroundColor={Colors.white} color={Colors.black} outlineColor={Colors.primary} onPress={handlePrev}></Button>
          </View>
          <View paddingV-8>
            <Button label='提交' borderRadius={4} style={{ height: 48 }} backgroundColor={Colors.primary} onPress={handleNext}></Button>
          </View>
        </View>
      </ScrollView>
    </RNView>
  );
};

const styles = StyleSheet.create({

});
