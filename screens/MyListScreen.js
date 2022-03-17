import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from 'react-native-ui-lib'
import { Colors } from '../config'
import { InlineForm, DateRange, Select, TableView } from '../components'
import { useDistrict, useBugCategory, useTemplateFixedPointList, useUserTemplateList } from "../hooks/useData";


const columns = [{
  title: '序号',
  dataIndex: 'index',
  width: 48
}, {
  title: '监测点名称',
  dataIndex: 'name'
}, {
  title: '监测虫害',
  dataIndex: 'bugName'
}, {
  title: '监测时间',
  dataIndex: 'recordTime'
}]

const defaultOption = {
  value: 0,
  label: '全部'
}


const checkUserTemplateItem = (data) => {
  return data._treeId && data._preId && (data._fileList || []).length > 0
}

const makeQuery = (values) => {
  return Object.entries(values).reduce((result, item) => {
    const [key, value] = item;
    if (value) {
      if (key === 'date' && value.length > 0) {
        const [startDate, endDate] = value;
        result.startMonitorTime = startDate
        result.endMonitorTime = endDate
      } else if (typeof value === 'object') {
        result[key] = value.value === '0' ? undefined : value.value
      } else {
        result[key] = value === '全部' ? undefined : value
      }
    }

    return result
  }, {})
}


export const MyListScreen = ({ navigation }) => {
  const [query, setQuery] = useState({
    current: 1,
    size: 15,
    // district: '',
    // bugId: '',
    // startMonitorTime: '',
    // endMonitorTime: ''
  })

  const { data, error, loading } = useTemplateFixedPointList({ query, userId: 1640764667575, });
  const { data: districtRange = [] } = useDistrict()
  const { data: bugCategoryRange = [] } = useBugCategory()
  const { data: userTemplateList = [], remove, clearAll } = useUserTemplateList();

  const makeData = useMemo(() => {
    if (!data || !userTemplateList) {
      return []
    }
    const userTemplateSize = userTemplateList.length;

    return [...userTemplateList.map((item, index) => ({
      ...item,
      status: checkUserTemplateItem(item) ? '0' : '1', // 0未上线 1不可上线
      index: index + 1
    })), ...data.map((item, index) => {
      return {
        ...item,
        status: '2',
        index: (userTemplateSize + index) + 1
      }
    })]
  }, [data, userTemplateList])

  const uploadUserTemplate = () => {
    const uploadList = userTemplateList.map(item => ({ ...item, status: checkUserTemplateItem(item) ? '0' : '1' })).filter(item => item.status === '0')
    if (uploadList.length === 0) {
      return
    }

    uploadList.forEach(item => {
      remove({
        ...item,
        templateCellDataMap: makeTableCellData(item._tableDataIndexMap, item._tableData, item._tableDataSize),   // [{index:1, cell-3:1, cell-1:3}]
        "monitorAvg": 5,
        "monitorSum": 15,
        "phenology": 1,
      })
    })
  }

  const handleClick = ({ id, deviceId, status, templateId }) => {
    if (status !== '2') {
      navigation.navigate('CreateStep1', {
        deviceId,
        templateId
      })
      return
    }
    navigation.navigate('Details', {
      deviceId,
      id
    })
  }

  const onFilter = values => {
    const newQuery = makeQuery(values)
    setQuery({
      ...query,
      ...newQuery
    })
  }

  return (
    <View style={styles.container}>
      <InlineForm onChange={onFilter}>
        <Select placeholder='请选择虫害' options={[defaultOption, ...bugCategoryRange]} name='bugId' />
        <Select placeholder='请选择区域' options={[{ label: '全部' }, ...districtRange]} name='district' />
        <DateRange name='date' width='70%' />
        <Button width='30%' backgroundColor={Colors.primary} size='small' borderRadius={0} label='上传数据' />
      </InlineForm>
      <TableView showDot columns={columns} dataSource={makeData} onClick={handleClick}></TableView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
